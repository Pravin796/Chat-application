import React, { useEffect, useRef, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { baseURL, Axios } from '../Services/AxiosHelper';
import toast from 'react-hot-toast';
import SockJS from "sockjs-client"
import Stomp from "stompjs"

const ChatPage = () => {
    const { roomId, currentUser, setRoomId, setCurrentUser } = useChatContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!roomId || !currentUser) {
            navigate('/');
        }
    }, [roomId, currentUser, navigate]);

    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);

    // Actual messages state
    const [messages, setMessages] = useState([]);

    // Ref to track the bottom of the chat for auto-scrolling
    const chatBoxRef = useRef(null);

    // Auto-scroll to the bottom whenever a new message is added
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && stompClient && stompClient.connected) {
            const messageRequest = {
                content: message,
                sender: currentUser || 'Guest'
            };

            // Sends to the Spring backend. Note: Spring typically uses "/app" as the destination prefix. 
            // If you changed it to something else in WebSocketMessageBrokerConfigurer, update "/app" here.
            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(messageRequest));
            setMessage('');
        }
    };

    useEffect(() => {
        let client = null;
        let isMounted = true; // Track if component is still mounted

        const loadMessages = async () => {
            try {
                // Fetch previous messages. Axios is configured with base URL '/api'
                // So this translates to http://localhost:8080/api/rooms/{roomId}/messages
                const response = await Axios.get(`/rooms/${roomId}/messages`);
                if (isMounted) {
                    setMessages(response.data);
                }
            } catch (error) {
                console.error("Failed to load old messages:", error);
            }
        };

        const connectWebsocket = () => {
            // Ensure you have the correct websocket endpoint here (e.g. `${baseURL}/chat` or `${baseURL}/ws`)
            // depending on your Spring Boot backend configuration.
            const sock = new SockJS(`${baseURL}/chat`)

            client = Stomp.over(sock)

            client.connect({}, () => {
                // If React unmounted this component while the connection was opening, disconnect immediately!
                if (!isMounted) {
                    client.disconnect();
                    return;
                }

                setStompClient(client);
                toast.success("Connected to websocket");

                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    console.log("Message received:", message);
                });
            })
        }

        if (roomId) {
            loadMessages();
            connectWebsocket();
        }

        // Cleanup function: Disconnect websocket when component unmounts or roomId changes
        return () => {
            isMounted = false;
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [roomId])

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Navbar */}
            <header className="flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser || 'Guest'}`}
                            alt="User"
                            className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Room: <span className="text-blue-600 dark:text-blue-400">#{roomId || 'General'}</span>
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Logged in as <span className="font-semibold text-gray-700 dark:text-gray-300">{currentUser || 'Guest'}</span>
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setRoomId('');
                        setCurrentUser('');
                        navigate('/');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg transition-colors font-medium cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Leave Room
                </button>
            </header>

            {/* Chat Body */}
            <main className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => {
                    const isOwn = msg.sender === currentUser;
                    const timeString = msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                    <div key={msg.id || index} className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        {!isOwn && (
                            <img
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.sender}`}
                                alt={msg.sender}
                                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 self-start"
                            />
                        )}

                        <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 mx-1">
                                {msg.sender} • {timeString}
                            </span>
                            <div
                                className={`px-5 py-3 rounded-2xl shadow-sm ${isOwn
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                    }`}
                            >
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>

                        {isOwn && (
                            <img
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.sender}`}
                                alt={msg.sender}
                                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 self-start"
                            />
                        )}
                    </div>
                )})}
                
                {/* Invisible element to anchor the auto-scroll */}
                <div ref={chatBoxRef} />
            </main>

            {/* Input Area */}
            <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-end gap-3">
                    <button
                        type="button"
                        className="p-3 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        title="Attach File"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Type your message here..."
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white resize-none max-h-32 min-h-[52px]"
                            rows="1"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 translate-x-0.5 -translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
}

export default ChatPage;
