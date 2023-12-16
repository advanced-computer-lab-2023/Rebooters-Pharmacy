import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../styles/Pharmacist_DoctorChats.css'

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
      console.log('Fetched chats:', json); // Log the fetched chats for debugging

      // Filter out closed chats
      const openChats = json.filter((chat) => !chat.closed);
      console.log('Open chats:', openChats); // Log the open chats for debugging

      setChats(openChats);

      // Set the selected doctor if there's an active chat
      const activeChat = openChats.find((chat) => chat.pharmacist === selectedDoctor);
      if (activeChat) {
        setSelectedDoctor(activeChat.pharmacist);
        setActiveChat(activeChat._id);
      }
    } else {
      console.error('Failed to fetch chats:', response.status, response.statusText);
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

      
      // Refresh the chat list by filtering out the deleted chat
      setChats(chats.filter((chat) => chat._id !== chatId));
      // Clear the selected doctor when the chat is closed
      setSelectedDoctor('');


    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className='card dc'>
      <div className='card-header doc-text text-black'>
        <h2>Chat With a Selected Doctor</h2>
      </div>
      <div className='card-body'>

         {/* Start a New Chat section */}
       
         <div className='new-chat-container'>
            <h3>Start a New Chat</h3>
            {errorMessage && <p className='error-message'> {errorMessage}</p>}
            <textarea
              rows="2"
              className="form-control mt-3"
              placeholder="Type your message here..."
              value={newChatContent}
              onChange={(e) => setNewChatContent(e.target.value)}
            ></textarea>
            <br />
            <label>Select a Doctor:</label>
            <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
              <option value="" disabled>
                Select a doctor
              </option>
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
          
        {/* Existing Chats */}
        {chats.map((chat) => (
          <div key={chat._id}>
            {chat.closed ? (
              <div>
                <p>This chat is closed.</p>
              </div>
            ) : (
              <div>
                <div >
                  {chat.messages &&
                    chat.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`message2 ${message.userType === 'pharmacist' ? 'pharmacist-message2' : 'doctor-message2'}`}
                      >
                        <div className="message-content2">
                          <strong>{message.userType === 'pharmacist' ? 'Pharmacist' : 'Doctor'}:</strong>
                          {message.content}
                        </div>
                        <span className="text-muted timestamp">
                          {moment(message.timestamp).format('MMM DD, YYYY h:mm A')}
                        </span>
                      </div>
                    ))}
                </div>
  
                <div style={{ marginTop: '10px' }}>
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  <textarea
                    rows="2"
                    className="form-control mt-3"
                    placeholder="Type your reply here..."
                    value={messageContents[chat._id] || ''}
                    onChange={(e) =>
                      setMessageContents({ ...messageContents, [chat._id]: e.target.value })
                    }
                  ></textarea>
                  
                  {/* Button container with flex layout */}
                  <div style={{ marginTop: '10px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => continueChat(chat._id)}
                    style={{ marginRight: '10px',  marginTop: '10px' }}
                  >
                    Send
                  </button>
                  <button
                    className='btn btn-secondary'
                    onClick={() => deleteChat(chat._id)}
                    style={{ marginRight: '10px',  marginTop: '10px' }}
                  >
                    Close Chat
                  </button>
                </div>

                </div>
              </div>
            )}
          </div>
        ))}
        
      </div>
    </div>
  );
            }  


export default Pharmacist_DoctorChats;
