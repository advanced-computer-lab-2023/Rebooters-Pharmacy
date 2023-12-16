import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Spinner } from 'react-bootstrap'; 
import '../styles/ChatWithDoctor.css';

const ChatWithDoctor = () => {
  const [chats, setChats] = useState([]);
  const [messageContents, setMessageContents] = useState({});
  const [pollingInterval, setPollingInterval] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const messagesEndRef = useRef(null);

  const fetchChats = async () => {
    try {
      const response = await fetch(`/api/pharmacist/ChatsToDoctor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const json = await response.json();
        // Filter out closed chats
        const activeChats = json.filter((chat) => !chat.closed);
        setChats(activeChats);
        setLoading(true); 
      } else {
        setChats([]);
        setLoading(false); 
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    // Fetch chats when the component mounts
    fetchChats();

    // Start polling for new messages every 5 seconds (adjust as needed)
    const interval = setInterval(() => {
      fetchChats();
    }, 2000); // Poll every 5 seconds

    // Save the interval ID for cleanup
    setPollingInterval(interval);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  const sendMessageToDoctor = async (chatId) => {
    const content = messageContents[chatId] || "";

    try {
      if (!content.trim()) {
        return;
      }

      const response = await fetch("/api/pharmacist/sendMessageToDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageContent: content }),
      });
      const json = await response.json();

      // Refresh the chat list
      setChats((prevChats) =>
        prevChats.map((chat) => (chat._id === chatId ? json : chat))
      );
      // Clear the content for the specific chatId
      setMessageContents({ ...messageContents, [chatId]: "" });
    } catch (error) {
      console.error("Error sending message to chat:", error);
    }
  };



  return (
    <div className="card doctor-card">
      <div className="card-header doctor-chat-text text-white">
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
        <div>
          {chats.map((chat) => (
            <div key={chat._id} className="mb-4">
              {!chat.closed && (
                <>
                  <h4 className="mb-3">Chat ID: {chat._id}</h4>
                  <div>
                    {chat.messages.length > 0 &&
                      chat.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`message-box ${
                            message.userType === 'doctor'
                              ? 'patient-message-box'
                              : 'pharmacist-message-box'
                          }`}
                        >
                          <div>
                            <strong>
                              {message.userType === 'doctor' ? 'Doctor' : 'Pharmacist'}:
                            </strong>
                            {message.content}
                          </div>
                          <span className="text-muted timestamp1">
                            {moment(message.timestamp).format('MMM DD, YYYY h:mm A')}
                          </span>
                        </div>
                      ))}
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Type your reply here..."
                      value={messageContents[chat._id] || ''}
                      onChange={(e) =>
                        setMessageContents({
                          ...messageContents,
                          [chat._id]: e.target.value,
                        })
                      }
                    ></textarea>
                    <br />
                    <button
                      className="btn btn-primary"
                      onClick={() => sendMessageToDoctor(chat._id)}
                      style={{ marginLeft: '10px' }}
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatWithDoctor;
