import React, { useState, useEffect } from 'react';
import axiosApi from '../axiosApi';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [lastMessageDate, setLastMessageDate] = useState('');

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
                <h2 className='font-bold text-4xl flex justify-center mt-8 '>
                    Chat App
                </h2>
                <div>
                    {messages.map((message) => (
                        <div key={message._id}>
                            <p>{message.message}</p>
                            <p>Author: {message.author}</p>
                            <p>Date and Time: {message.datetime}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
            </div>
        </>
    );
};

export default Chat;
