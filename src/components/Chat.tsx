import React, { useState, useEffect } from 'react';
import axiosApi from '../axiosApi';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [author, setAuthor] = useState('YourName');
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

    const sendMessage = async () => {
        try {
            const url = '/messages'; // Use relative path
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
                <h2 className='font-bold text-4xl flex justify-center mt-6 '>
                    Chat App
                </h2>
                <div className='border-2 max-w-96 '>
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
                <input
                    className='border-2 rounded-lg '
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    required
                />
                <input
                    className='border-2 rounded-lg text-blue-500'
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your Name"
                    required
                />
                <button className='border-2 ml-1 rounded-lg text-blue-500' onClick={sendMessage}>Send</button>
            </div>
        </>
    );
};

export default Chat;
