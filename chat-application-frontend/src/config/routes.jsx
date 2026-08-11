import { Route, Routes } from "react-router-dom"
import App from "../App"
import ChatPage from "../componets/ChatPage"

const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/chats" element={<ChatPage />} />
        </Routes>
    )
}

export default AllRoutes;