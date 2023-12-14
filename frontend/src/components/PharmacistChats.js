// PharmacistChats.js

import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Spinner } from 'react-bootstrap'; // Import Spinner from react-bootstrap
import '../styles/PharmacistChats.css'; // Import your CSS file for additional styling

const PharmacistChats = () => {
  const [chats, setChats] = useState([]);
  const [messageContents, setMessageContents] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const messagesEndRef = useRef(null);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/pharmacist/viewAllChats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        setChats(json);
        setLoading(true); // Set loading to false when data is fetched
      } else {
        setChats([]);
        setLoading(false); // Set loading to false even if there's an error
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  useEffect(() => {
    fetchChats();

    // Poll for new messages every 2 seconds
    const intervalId = setInterval(fetchChats, 2000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const sendMessageToChat = async (chatId) => {
    const content = messageContents[chatId] || '';

    try {
      if (!content.trim()) {
        return;
      }

      const response = await fetch("/api/pharmacist/sendMessageToChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageContent: content }),
      });

      const json = await response.json();

      // Refresh the chat list
      setChats(chats.map((chat) => (chat._id === chatId ? json : chat)));
      // Clear the content for the specific chatId
      setMessageContents({ ...messageContents, [chatId]: '' });
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message to chat:', error);
    }
  };

  return (
    <div className="card chat-container">
      <div className="card-header bg-chat-text text-white">
        <h2>
          {chats.length === 0 ? 'Chat' : 'Chatting... '}
          {loading && <Spinner animation="border" variant="light" />}
        </h2>
      </div>
      {chats.length === 0 && !loading ? (
       <div className="card-body text-center">
       <p className="text font-weight-bold">There are no chats</p>
     </div>
      ) : (
        <div className="card-body chat-body">
          {chats.map((chat) => (
            <div key={chat._id} className="mb-4">
              <h4 className="mb-3">Chat ID: {chat._id}</h4>
              <div className="chat-box">
                {chat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.userType === 'patient' ? 'patient-message' : 'pharmacist-message'}`}
                  >
                    <div className="message-content">
                      <strong>{message.userType === 'patient' ? 'Patient' : 'Pharmacist'}:</strong>
                      {message.content}
                    </div>
                    <span className="text-muted timestamp">
                      {moment(message.timestamp).format('MMM DD, YYYY h:mm A')}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>
              <textarea
                rows="2"
                className="form-control mt-3"
                placeholder="Type your reply here..."
                value={messageContents[chat._id] || ''}
                onChange={(e) =>
                  setMessageContents({ ...messageContents, [chat._id]: e.target.value })
                }
              ></textarea>
              <button
                className="btn btn-primary mt-2"
                onClick={() => sendMessageToChat(chat._id)}
              >
                Send
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PharmacistChats;
