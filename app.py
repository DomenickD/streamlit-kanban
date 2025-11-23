import streamlit as st
from kanban_board import kanban_board

st.set_page_config(layout="wide")

st.title("Streamlit React Kanban Board")

st.markdown("""
This is a custom Streamlit component built with React and @dnd-kit.
Try dragging items between columns!
""")

# Initialize session state for the board if it doesn't exist
if 'board_state' not in st.session_state:
    st.session_state.board_state = [
        {
            "id": "todo",
            "title": "To Do",
            "items": [
                {
                    "id": "item-1",
                    "content": "Research Streamlit Components",
                    "description": "Read the official documentation and check out examples.",
                    "assignee": "Domenick",
                    "priority": "High"
                },
                {
                    "id": "item-2",
                    "content": "Set up React project",
                    "description": "Initialize Vite, install dependencies, and configure tsconfig.",
                    "assignee": "AI Assistant",
                    "priority": "High"
                },
                {
                    "id": "item-3",
                    "content": "Implement Drag and Drop",
                    "description": "Use @dnd-kit to enable drag and drop functionality.",
                    "assignee": "Domenick",
                    "priority": "Medium"
                },
            ]
        },
        {
            "id": "in-progress",
            "title": "In Progress",
            "items": [
                {
                    "id": "item-4",
                    "content": "Write Python Wrapper",
                    "description": "Create the __init__.py file to expose the component.",
                    "assignee": "AI Assistant",
                    "priority": "Medium"
                },
            ]
        },
        {
            "id": "done",
            "title": "Done",
            "items": [
                {
                    "id": "item-5",
                    "content": "Project Planning",
                    "description": "Outline the features and structure of the component.",
                    "assignee": "Team",
                    "priority": "Low"
                },
            ]
        }
    ]

# Helper function to get all items
def get_all_items(board_state):
    items = []
    for col in board_state:
        items.extend(col["items"])
    return items

# --- Ticket Management ---
with st.expander("Ticket Management", expanded=False):
    col1, col2 = st.columns(2)
    
    # Add Ticket
    with col1:
        st.subheader("Add New Ticket")
        with st.form("add_ticket_form"):
            new_title = st.text_input("Title")
            new_desc = st.text_area("Description")
            new_assignee = st.text_input("Assignee")
            new_priority = st.selectbox("Priority", ["Low", "Medium", "High", "Critical"])
            submitted = st.form_submit_button("Add Ticket")
            
            if submitted and new_title:
                new_item = {
                    "id": f"item-{len(get_all_items(st.session_state.board_state)) + 100}",
                    "content": new_title,
                    "description": new_desc,
                    "assignee": new_assignee,
                    "priority": new_priority
                }
                st.session_state.board_state[0]["items"].append(new_item)
                st.success(f"Added '{new_title}' to To Do")
                st.rerun()

    # Remove Ticket
    with col2:
        st.subheader("Remove Tickets")
        all_items = get_all_items(st.session_state.board_state)
        items_to_remove = st.multiselect(
            "Select tickets to remove",
            options=[item["id"] for item in all_items],
            format_func=lambda x: next((item["content"] for item in all_items if item["id"] == x), x)
        )
        
        if st.button("Remove Selected"):
            for col in st.session_state.board_state:
                col["items"] = [item for item in col["items"] if item["id"] not in items_to_remove]
            st.success("Removed selected tickets")
            st.rerun()

# Render the component
# The component returns the new state whenever it changes
new_state = kanban_board(st.session_state.board_state, key="kanban_board")

# Update session state if the component returned a new state
if new_state and new_state != st.session_state.board_state:
    st.session_state.board_state = new_state
    st.rerun()

st.write("---")
st.subheader("Current State (Python)")
st.json(st.session_state.board_state)
