import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PharmacistChats = () => {
  const [chats, setChats] = useState([]);
  const [messageContents, setMessageContents] = useState({});

  useEffect(() => {
    // Fetch all chats when the component mounts
    const fetchChats = async () => {
      try {
        const response = await axios.get('/api/pharmacist/viewAllChats');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const sendMessageToChat = async (chatId) => {
    const content = messageContents[chatId] || '';

    try {
      if (!content.trim()) {
        // You can handle this case, e.g., show an error message to the pharmacist
        return;
      }

      const response = await axios.post('/api/pharmacist/sendMessageToChat', {
        chatId,
        messageContent: content,
      });
      console.log('Message sent:', response.data);

      // Refresh the chat list
      setChats(chats.map((chat) => (chat._id === chatId ? response.data : chat)));
      // Clear the content for the specific chatId
      setMessageContents({ ...messageContents, [chatId]: '' });
    } catch (error) {
      console.error('Error sending message to chat:', error);
    }
  };

  return (
    <div className='container'>
      <h2>All Chats</h2>
      <div>
        {chats.map((chat) => (
          <div key={chat._id}>
            <h4>Chat ID: {chat._id}</h4>
            <div>
              {chat.messages.map((message, index) => (
                <div key={index}>
                  <strong>{message.userType}: </strong> {message.content}
                  <span style={{ marginLeft: '10px', color: 'gray' }}>
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <textarea
              rows="1"
              cols="25"
              placeholder="Type your reply here..."
              value={messageContents[chat._id] || ''}
              onChange={(e) =>
                setMessageContents({ ...messageContents, [chat._id]: e.target.value })
              }
            ></textarea>
            <br />
            <button className='btn btn-primary' onClick={() => sendMessageToChat(chat._id)}>
              Send
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacistChats;
