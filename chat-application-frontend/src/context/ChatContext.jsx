import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(() => {
    return localStorage.getItem("roomId") || "";
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("currentUser") || "";
  });

  useEffect(() => {
    if (roomId) {
      localStorage.setItem("roomId", roomId);
    } else {
      localStorage.removeItem("roomId");
    }
  }, [roomId]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", currentUser);
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <ChatContext.Provider value={{ roomId, setRoomId, currentUser, setCurrentUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
