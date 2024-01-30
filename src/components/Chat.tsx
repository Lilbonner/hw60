import React, { useState, useEffect } from 'react';
import axiosApi from '../axiosApi';
import dayjs from 'dayjs';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [author, setAuthor] = useState('YourName');
    const [lastMessageDate, setLastMessageDate] = useState('');

    const formatDateTime = (datetime: string) => {
        return dayjs(datetime).format('DD.MM.YY HH:mm');
    };

    const fetchMessages = async () => {
        try {
            const url = lastMessageDate
                ? `/messages?datetime=${lastMessageDate}`
                : '/messages';

            const response = await axiosApi.get(url);
            const retrievedMessages = response.data;
            setMessages(retrievedMessages);
            if (retrievedMessages.length > 0) {
                setLastMessageDate(retrievedMessages[retrievedMessages.length - 1].datetime);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            const url = '/messages';
            const data = new URLSearchParams();
            data.set('message', newMessage);
            data.set('author', author);

            await axiosApi.post(url, data);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [lastMessageDate]);

    return (
        <>
            <div>
                <h2 className='text-white bg-gray-600 font-bold text-4xl flex justify-center py-5'>
                    Chat App
                </h2>
                <div className='border-2 bg-gray-300'>
                    {messages.map((message) => (
                        <div className='border-2 rounded-lg' key={message._id}>
                            <p>{message.message}</p>
                            <p>Author: {message.author}</p>
                            <p>Date and Time: {formatDateTime(message.datetime)}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='bg-gray-400 bottom-0 w-full shadow-lg py-1'>
                <input
                    className='input w-full focus:outline-none bg-gray-100 rounded-r-none'
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    required
                />
                <input
                    className='border-2 bg-gray-100 rounded mt-2'
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your Name"
                    required
                />
                <button className='w-auto bg-gray-500 text-white rounded-r-lg px-5 text-sm' onClick={sendMessage}>Send</button>
            </div>
        </>
    );
};

export default Chat;
