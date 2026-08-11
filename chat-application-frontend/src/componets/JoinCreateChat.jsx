import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createRoomApi, joinRoomApi } from '../Services/RoomService';
import { useChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

const JoinCreateChat = () => {
    const [detail, setDetail] = useState({
        roomId: '',
        userName: ''
    });

    const { setRoomId, setCurrentUser } = useChatContext();
    const navigate = useNavigate();

    const handleFormInputChange = (e) => {
        setDetail({
            ...detail,
            [e.target.name]: e.target.value
        });
    };

    const joinChat = async () => {
        if (!detail.roomId || !detail.userName) {
            toast.error('Please enter both Name and Room ID');
            return;
        }

        try {
            const response = await joinRoomApi(detail.roomId);
            toast.success('Joined room successfully!');
            setRoomId(response.roomId || detail.roomId);
            setCurrentUser(detail.userName);
            navigate('/chats');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data);
        }
    };

    const createRoom = async () => {
        if (!detail.roomId || !detail.userName) {
            toast.error('Please enter both Name and Room ID');
            return;
        }

        try {
            const response = await createRoomApi({
                id: detail.roomId,
                name: detail.userName
            });
            toast.success('Room created successfully!');

            setRoomId(response.roomId || detail.roomId);
            setCurrentUser(detail.userName);
            navigate('/chats');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error creating room');
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-all">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                    Welcome to Chat
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Join an existing room or create a new one to start chatting!
                </p>
            </div>

            <div className="space-y-5">
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={detail.userName}
                        onChange={handleFormInputChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white placeholder-gray-400"
                    />
                </div>

                <div>
                    <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Room ID
                    </label>
                    <input
                        type="text"
                        id="roomId"
                        name="roomId"
                        value={detail.roomId}
                        onChange={handleFormInputChange}
                        placeholder="Enter room ID"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white placeholder-gray-400"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        onClick={joinChat}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                    >
                        Join Room
                    </button>
                    <button
                        onClick={createRoom}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                    >
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinCreateChat;
