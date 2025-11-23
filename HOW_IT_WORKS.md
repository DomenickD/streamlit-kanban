# Class in Session: How Streamlit Talks to React 🎓

Welcome, students! Today we're going to demystify the "magic" bridge between your Python Streamlit app and your custom React component.

Think of this relationship like a **Walkie-Talkie conversation**. One side speaks, the other listens, acts, and speaks back.

---

## 1. The Setup: The IFrame

First, understand that your React component lives inside an `<iframe>` within the Streamlit app. They are two separate worlds. We need a bridge to cross them.

## 2. Python Speaks First (Sending Data) 🐍 -> ⚛️

In `kanban_board/__init__.py`, we define the "phone line".

### The Declaration
We tell Streamlit where to find our React code (localhost for dev, a build folder for prod).

```python
_component_func = components.declare_component(
    "kanban_board",
    url="http://localhost:5173",  # 👈 Points to our Vite dev server
)
```

### The Call
When you call your function in `app.py`, you are packing a suitcase of data to send across the bridge.

```python
# In app.py
kanban_board(st.session_state.board_state)
```

This calls our wrapper in `__init__.py`:

```python
def kanban_board(columns, key=None):
    # We pass 'columns' as a keyword argument.
    # Streamlit serializes this to JSON and sends it to React.
    component_value = _component_func(columns=columns, key=key, default=columns)
    return component_value
```

**Key Concept:** Any keyword argument you pass to `_component_func` (like `columns=columns`) becomes available in React.

---

## 3. React Listens (Receiving Data) ⚛️

Over in `KanbanBoard.tsx`, we need to pick up the phone. We use a hook called `useRenderData`.

```tsx
import { useRenderData } from "streamlit-component-lib-react-hooks";

const KanbanBoard = () => {
  // 1. Unpack the suitcase
  const { args } = useRenderData();

  // 2. 'args' contains everything we sent from Python!
  // args.columns is the list of dictionaries we passed.
  
  useEffect(() => {
    if (args && args.columns) {
      setColumns(args.columns); // Update React state with Python data
    }
  }, [args]);
  
  // ... render your component
};
```

---

## 4. React Speaks Back (Sending Updates) ⚛️ -> 🐍

This is the cool part. When a user drags an item, we don't just update the UI; we tell Python about it.

We use `Streamlit.setComponentValue`.

```tsx
import { Streamlit } from "streamlit-component-lib";

const handleDragEnd = (event) => {
    // ... calculate new column state ...
    
    const newColumns = [...prev]; 
    // Perform the move logic...
    
    // 📞 CALL PYTHON!
    Streamlit.setComponentValue(newColumns);
};
```

**What happens next?**
1.  `Streamlit.setComponentValue` sends the JSON back to Python.
2.  The Streamlit script **RERUNS** from the top (just like when you click a button).
3.  The `kanban_board` function in Python returns this *new* value.

---

## 5. The Cycle Completes 🔄

Back in `app.py`:

```python
# This line executes again. 
# 'new_state' is now the value we sent from React!
new_state = kanban_board(st.session_state.board_state)

if new_state:
    # We update our source of truth in Python
    st.session_state.board_state = new_state
```

### Summary

1.  **Python** sends `args` -> **React** renders.
2.  **User** interacts (Drag & Drop).
3.  **React** calls `setComponentValue` -> **Python** script reruns.
4.  **Python** receives new data -> Updates `session_state`.

Class dismissed! 🔔
