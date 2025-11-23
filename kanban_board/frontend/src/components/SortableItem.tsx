
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Item from "./Item";

interface SortableItemProps {
    id: string;
    content: string;
    description?: string;
    assignee?: string;
    priority?: string;
    onClick?: (id: string) => void;
}

const SortableItem = ({ id, content, description, assignee, priority, onClick }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Item
                id={id}
                content={content}
                description={description}
                assignee={assignee}
                priority={priority}
                onClick={() => onClick && onClick(id)}
            />
        </div>
    );
};

export default SortableItem;
