import React, { useState, useEffect } from 'react';
import moment from 'moment';
import "../styles/patientChat.css";

const PatientChats = () => {
  const [newChatContent, setNewChatContent] = useState('');
  const [messageContents, setMessageContents] = useState({});
  const [chats, setChats] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/patient/viewMyChats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setChats(json);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();

    // Poll for new messages every 2 seconds
    const pollingInterval = setInterval(fetchChats, 2000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  const startNewChat = async () => {
    try {
      if (!newChatContent.trim()) {
        setErrorMessage('You have to type something');
        return;
      }

      const response = await fetch("/api/patient/startNewChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageContent: newChatContent }),
      });
      const json = await response.json();
      // Refresh the chat list
      setChats([...chats, json]);
      // Clear the newChatContent and error message
      setNewChatContent('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error starting a new chat:', error);
    }
  };

  const continueChat = async (chatId) => {
    const content = messageContents[chatId] || '';
    try {
      if (!content.trim()) {
        setErrorMessage('You have to type something');
        return;
      }
      const response = await fetch("/api/patient/continueChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageContent: content }),
      });
      const json = await response.json();

      // Refresh the chat list
      setChats(chats.map((chat) => (chat._id === chatId ? json : chat)));
      // Clear the content for the specific chatId and error message
      setMessageContents({ ...messageContents, [chatId]: '' });
      setErrorMessage('');
    } catch (error) {
      console.error('Error continuing the chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await fetch(`/api/patient/deleteChat/${chatId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remove the closed chat from the frontend
        setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
      } else {
        console.error('Error deleting chat:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className='container'>
      <div className='card' style={{ border: '2px solid black' }}>
        <div className='card-header' style={{ backgroundColor: '#44bab1' }}>
          <h2>My Chat</h2>
        </div>
        <div className='card-body'>
          <div>
            {/* Start a New Chat */}
            {chats.map((chat) => (
              <div key={chat._id}>
                {!chat.closed ? (
                  <div>
                    <h4>Continue Chat</h4>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {chat.messages &&
                    chat.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`message2 ${message.userType === 'pharmacist' ? 'pharmacist-message2' : 'doctor-message2'}`}
                      >
                        <div className="message-content2">
                          <strong>{message.userType === 'pharmacist' ? 'Pharmacist' : 'Patient'}:</strong>
                          {message.content}
                        </div>
                        <span className="text-muted timestamp">
                          {moment(message.timestamp).format('MMM DD, YYYY h:mm A')}
                        </span>
                      </div>
                    ))}
                    <input
                      className='form-control'
                      style={{ width: '250px', height: '48px' }}
                      placeholder="Type your message here..."
                      value={messageContents[chat._id] || ''}
                      onChange={(e) =>
                        setMessageContents({ ...messageContents, [chat._id]: e.target.value })
                      }
                    ></input>
                    <br />
                    <button className='btn btn-primary' onClick={() => continueChat(chat._id)}>
                      Send
                    </button>
                    <button
                      className='btn btn-secondary'
                      style={{ marginLeft: '10px' }}
                      onClick={() => deleteChat(chat._id)}
                    >
                      Close Chat
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
            {/* Display "Start a New Chat" only if all chats are closed */}
            {chats.every((chat) => chat.closed) && (
              <div>
                <h4>Start a New Chat</h4>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <input
                  className='form-control'
                  style={{ width: '250px', height: '48px' }}
                  placeholder="Type your message here..."
                  value={newChatContent}
                  onChange={(e) => setNewChatContent(e.target.value)}
                ></input>
                <br />
                <button className='btn btn-primary' onClick={startNewChat}>
                  Start Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientChats;
