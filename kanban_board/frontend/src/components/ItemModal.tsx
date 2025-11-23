import React, { useState } from "react";

interface ItemType {
    id: string;
    content: string;
    description?: string;
    assignee?: string;
    priority?: string;
}

interface ItemModalProps {
    item: ItemType;
    onClose: () => void;
    onSave: (updatedItem: ItemType) => void;
}

const ItemModal = ({ item, onClose, onSave }: ItemModalProps) => {
    const [content, setContent] = useState(item.content);
    const [description, setDescription] = useState(item.description || "");
    const [assignee, setAssignee] = useState(item.assignee || "");
    const [priority, setPriority] = useState(item.priority || "Medium");

    const handleSave = () => {
        onSave({
            ...item,
            content,
            description,
            assignee,
            priority,
        });
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "8px",
                    width: "500px",
                    maxWidth: "90%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: 0, color: "#31333F" }}>Edit Item</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontWeight: 600, fontSize: "14px", color: "#31333F" }}>Title</label>
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontWeight: 600, fontSize: "14px", color: "#31333F" }}>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                        <label style={{ fontWeight: 600, fontSize: "14px", color: "#31333F" }}>Assignee</label>
                        <input
                            type="text"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                        <label style={{ fontWeight: 600, fontSize: "14px", color: "#31333F" }}>Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            background: "white",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "4px",
                            border: "none",
                            background: "#ff4b4b",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;
