import React, { useState, useEffect } from 'react';


const PatientChats = () => {
  const [newChatContent, setNewChatContent] = useState('');
  const [messageContents, setMessageContents] = useState({});
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
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
      // Set the active chat to the newly created chat
      setActiveChat(json._id);
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
        body: JSON.stringify({ chatId, messageContent: content}),
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
      // Reset the active chat to null
      setActiveChat(null);

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
      <h2>My Chat</h2>
      <div>
        {/* Start a New Chat */}
        {activeChat === null && (
          <div>
            <h3>Start a New Chat</h3>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <textarea
              rows="1"
              cols="25"
              placeholder="Type your message here..."
              value={newChatContent}
              onChange={(e) => setNewChatContent(e.target.value)}
            ></textarea>
            <br />
            <button className='btn btn-primary' onClick={startNewChat}>
              Start Chat
            </button>
          </div>
        )}

        {/* Existing Chats */}
        <div>
          {chats.map((chat) => (
            <div key={chat._id}>
              <h4>
                {activeChat !== chat._id && (
                  <button
                    className='btn btn-danger'
                    style={{ marginLeft: '10px' }}
                    onClick={() => deleteChat(chat._id)}
                  >
                    Close Chat
                  </button>
                )}
              </h4>
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
              {activeChat === chat._id && (
                <div>
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  <textarea
                    rows="1"
                    cols="25"
                    placeholder="Type your message here..."
                    value={messageContents[chat._id] || ''}
                    onChange={(e) =>
                      setMessageContents({ ...messageContents, [chat._id]: e.target.value })
                    }
                  ></textarea>
                  <br />
                  <button className='btn btn-primary' onClick={() => continueChat(chat._id)}>
                    Send
                  </button>
                  <button
                    className='btn btn-danger'
                    style={{ marginLeft: '10px' }}
                    onClick={() => deleteChat(chat._id)}
                  >
                    Close Chat
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientChats;
