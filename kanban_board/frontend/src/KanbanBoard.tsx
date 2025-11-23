import React, { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Streamlit } from "streamlit-component-lib";
import { useRenderData } from "streamlit-component-lib-react-hooks";
import Column from "./components/Column";

import Item from "./components/Item";
import ItemModal from "./components/ItemModal";

// Define types
interface ItemType {
    id: string;
    content: string;
    description?: string;
    assignee?: string;
    priority?: string;
}

interface ColumnType {
    id: string;
    title: string;
    items: ItemType[];
}

const KanbanBoard = () => {
    const { args } = useRenderData();
    const [columns, setColumns] = useState<ColumnType[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

    // Initialize state from Streamlit args
    useEffect(() => {
        if (args && args.columns) {
            setColumns(args.columns);
        }
    }, [args]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require slight movement to start drag, allowing clicks
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findColumn = (id: string) => {
        return columns.find((col) => col.items.some((item) => item.id === id))?.id || columns.find((col) => col.id === id)?.id;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeColumnId = findColumn(active.id as string);
        const overColumnId = findColumn(overId as string);

        if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

        setColumns((prev) => {
            const activeColIndex = prev.findIndex((col) => col.id === activeColumnId);
            const overColIndex = prev.findIndex((col) => col.id === overColumnId);

            const activeItems = prev[activeColIndex].items;
            const overItems = prev[overColIndex].items;

            const activeItemIndex = activeItems.findIndex((item) => item.id === active.id);
            const overItemIndex = overItems.findIndex((item) => item.id === overId);

            let newIndex;
            if (overItemIndex === -1) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                    over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overItemIndex >= 0 ? overItemIndex + modifier : overItems.length + 1;
            }

            const newColumns = [...prev];
            const [movedItem] = newColumns[activeColIndex].items.splice(activeItemIndex, 1);
            newColumns[overColIndex].items.splice(newIndex, 0, movedItem);

            return newColumns;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeColumnId = findColumn(active.id as string);
        const overColumnId = findColumn(over?.id as string);

        if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
            const activeColIndex = columns.findIndex((col) => col.id === activeColumnId);
            const activeItems = columns[activeColIndex].items;
            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = activeItems.findIndex((item) => item.id === over?.id);

            if (activeIndex !== overIndex) {
                setColumns((prev) => {
                    const newColumns = [...prev];
                    newColumns[activeColIndex].items = arrayMove(activeItems, activeIndex, overIndex);
                    Streamlit.setComponentValue(newColumns);
                    return newColumns;
                });
            }
        } else {
            Streamlit.setComponentValue(columns);
        }

        setActiveId(null);
    };

    const handleItemClick = (item: ItemType) => {
        setSelectedItem(item);
    };

    const handleItemUpdate = (updatedItem: ItemType) => {
        setColumns((prev) => {
            const newColumns = prev.map(col => ({
                ...col,
                items: col.items.map(item => item.id === updatedItem.id ? updatedItem : item)
            }));
            Streamlit.setComponentValue(newColumns);
            return newColumns;
        });
        setSelectedItem(null);
    };

    // Helper to find the active item object for the overlay
    const activeItem = activeId
        ? columns.flatMap((col) => col.items).find((item) => item.id === activeId)
        : null;

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: "20px", padding: "20px", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {columns.map((col) => (
                    <Column
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        items={col.items}
                        onItemClick={handleItemClick}
                    />
                ))}
                <DragOverlay>
                    {activeItem ? (
                        <Item
                            id={activeItem.id}
                            content={activeItem.content}
                            description={activeItem.description}
                            assignee={activeItem.assignee}
                            priority={activeItem.priority}
                            isOverlay
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {selectedItem && (
                <ItemModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onSave={handleItemUpdate}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
