# Streamlit React Kanban Component

This is a custom Streamlit component that renders a Kanban board using React and `@dnd-kit`.

## Project Structure

- `kanban_board/`: The Python package for the component.
  - `__init__.py`: The main Python wrapper.
  - `frontend/`: The React frontend.
- `app.py`: A demo Streamlit app that uses the component.

## Setup and Running

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

Navigate to the frontend directory and install the Node modules:

```bash
cd kanban_board/frontend
npm install
```

### 3. Run the Frontend Development Server

In the `kanban_board/frontend` directory, run:

```bash
npm run dev
```

This will start the Vite dev server on `http://localhost:5173`.

### 4. Run the Streamlit App

Open a new terminal, navigate to the root `streamlit_kanban` directory, and run:

```bash
streamlit run app.py
```

You should see the Kanban board in your browser. Drag and drop items to see the state update in Python!

## Building for Production

To build the frontend for production (so you don't need to run `npm run dev`):

1.  Run `npm run build` in `kanban_board/frontend`.
2.  In `kanban_board/__init__.py`, set `_RELEASE = True`.
