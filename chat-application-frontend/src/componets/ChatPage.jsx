import React, { useEffect, useRef, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
    const { roomId, currentUser, setRoomId, setCurrentUser } = useChatContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!roomId || !currentUser) {
            navigate('/');
        }
    }, [roomId, currentUser, navigate]);

    const [message, setMessage] = useState('');
    // Dummy messages for design preview
    const [messages, setMessages] = useState([
        { id: 1, sender: 'John Doe', content: 'Hey, how are you?', time: '10:00 AM', isOwn: false },
        { id: 2, sender: 'You', content: 'I am good, thanks! How about you?', time: '10:02 AM', isOwn: true },
        { id: 3, sender: 'John Doe', content: 'Doing great, just working on this chat app design.', time: '10:05 AM', isOwn: false },
    ]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            setMessages([...messages, {
                id: Date.now(),
                sender: 'You',
                content: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: true
            }]);
            setMessage('');
        }
    };

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
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                        {!msg.isOwn && (
                            <img 
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.sender}`} 
                                alt={msg.sender} 
                                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 self-start"
                            />
                        )}
                        
                        <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 mx-1">
                                {msg.sender} • {msg.time}
                            </span>
                            <div 
                                className={`px-5 py-3 rounded-2xl shadow-sm ${
                                    msg.isOwn 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                }`}
                            >
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>

                        {msg.isOwn && (
                            <img 
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.sender}`} 
                                alt={msg.sender} 
                                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 self-start"
                            />
                        )}
                    </div>
                ))}
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
