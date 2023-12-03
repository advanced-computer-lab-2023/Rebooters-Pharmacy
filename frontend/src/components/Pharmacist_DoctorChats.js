import React, { useState, useEffect } from 'react';

const Pharmacist_DoctorChats = () => {
  const [newChatContent, setNewChatContent] = useState('');
  const [messageContents, setMessageContents] = useState({});
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null); 

  useEffect(() => {
    // Fetch doctors and chats on component mount
    fetchDoctors();
    fetchChats();

    // Poll for new messages every 2 seconds
    const pollingInterval = setInterval(fetchChats, 2000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  const fetchDoctors = async () => {
    // Fetch the list of available doctors
    try {
      const response = await fetch('http://localhost:9000/api/patient/getAvailableDoctors', {
        credentials: 'include', // Include cookies in the request
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/pharmacist/viewMyChats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        // Filter out closed chats
        const openChats = json.filter((chat) => !chat.closed);
        setChats(openChats);
        // Set the selected doctor if there's an active chat
        const activeChat = openChats.find((chat) => chat.pharmacist === selectedDoctor);
        if (activeChat) {
          setSelectedDoctor(activeChat.pharmacist);
          setActiveChat(activeChat._id);
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const startNewChat = async () => {
    try {
      
      if (!newChatContent.trim()) {
        setErrorMessage('You have to type something');
        return;
      }

      // If there's an active chat, continue it instead of starting a new one
      if (activeChat) {
        continueChat(activeChat);
        return;
      }

      if (!selectedDoctor) {
        setErrorMessage('Please select a doctor');
        return;
      }

      const response = await fetch("/api/pharmacist/startNewChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageContent: newChatContent, selectedDoctor })
      });

      console.log('Response:', response);
      if (response.ok) {
        const json = await response.json();

        console.log('json.savedChat:', json.savedChat);
        console.log('json.savedChat._id:', json.savedChat._id);

        if (json.savedChat && json.savedChat._id) {
          setActiveChat(json.savedChat._id);
          // Refresh the chat list
          setChats([...chats, json.savedChat]);
          // Clear the newChatContent and error message
          setNewChatContent('');
          setErrorMessage('');
        } else {
          console.error('Error starting a new chat: savedChat or savedChat._id is undefined');
        }
      } else {
        // Handle error response
        console.error('Error starting a new chat:', response.status, response.statusText);
      }
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
  
      const response = await fetch("/api/pharmacist/continueChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageContent: content }),
      });
  
      if (response.ok) {
        // Refresh the chat list
        await fetchChats();
  
        // Clear the content for the specific chatId and error message
        setMessageContents({ ...messageContents, [chatId]: '' });
        setErrorMessage('');
      } else {
        console.error('Error continuing the chat:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error continuing the chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
  
      const response = await fetch(`/api/pharmacist/deleteChat/${chatId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Reset the active chat to null
      setActiveChat(null);
      // Refresh the chat list by filtering out the deleted chat
      setChats(chats.filter((chat) => chat._id !== chatId));
      // Clear the selected doctor when the chat is closed
      setSelectedDoctor('');


    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className='container'>
      <h2>Chats With Doctors</h2>
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
            <label>Select a Doctor:</label>
            <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
              <option value="" disabled>Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor.username}>
                  {doctor.name}
                </option>
              ))}
            </select>

            {selectedDoctor && (
              <div>
                <h2>Selected Doctor:</h2>
                <p>{selectedDoctor}</p>
              </div>
            )}
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
              {chat.closed && (
                <p>This chat is closed.</p>
              )}
              {!chat.closed && (
                <div>
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
                    {chat.messages && chat.messages.map((message, index) => (
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
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pharmacist_DoctorChats;
