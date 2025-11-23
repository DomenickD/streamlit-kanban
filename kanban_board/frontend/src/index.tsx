import React from "react"
import ReactDOM from "react-dom/client"
import KanbanBoard from "./KanbanBoard"
import { StreamlitProvider } from "streamlit-component-lib-react-hooks"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <StreamlitProvider>
            <KanbanBoard />
        </StreamlitProvider>
    </React.StrictMode>
)
