
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

interface ItemType {
    id: string;
    content: string;
    description?: string;
    assignee?: string;
    priority?: string;
}

interface ColumnProps {
    id: string;
    title: string;
    items: ItemType[];
    onItemClick?: (item: ItemType) => void;
}

const Column = ({ id, title, items, onItemClick }: ColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                background: "#f0f2f6",
                padding: "16px",
                borderRadius: "8px",
                flex: "1 1 0px",
                minWidth: "250px",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "600", color: "#31333F" }}>{title}</h3>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                    <SortableItem
                        key={item.id}
                        id={item.id}
                        content={item.content}
                        description={item.description}
                        assignee={item.assignee}
                        priority={item.priority}
                        onClick={() => onItemClick && onItemClick(item)}
                    />
                ))}
            </SortableContext>
        </div>
    );
};

export default Column;
