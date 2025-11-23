

interface ItemProps {
    id: string;
    content: string;
    description?: string;
    assignee?: string;
    priority?: string;
    isOverlay?: boolean;
    onClick?: () => void;
}

const Item = ({ content, assignee, priority, isOverlay, onClick }: ItemProps) => {
    return (
        <div
            onClick={onClick}
            style={{
                padding: "12px",
                background: "white",
                borderRadius: "4px",
                boxShadow: isOverlay
                    ? "0 5px 15px rgba(0,0,0,0.15)"
                    : "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "grab",
                border: "1px solid #e0e0e0",
                fontSize: "14px",
                color: "#31333F",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
            }}
        >
            <div style={{ fontWeight: 500 }}>{content}</div>
            {assignee && (
                <div style={{ fontSize: "12px", color: "#666" }}>
                    👤 {assignee}
                </div>
            )}
            {priority && (
                <div style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    background: priority === 'High' || priority === 'Critical' ? '#ffeeba' : '#e8e8e8',
                    alignSelf: 'flex-start',
                    marginTop: '4px'
                }}>
                    {priority}
                </div>
            )}
        </div>
    );
};

export default Item;
