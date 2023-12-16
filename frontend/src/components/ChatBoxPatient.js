// ChatBox.jsx
import React, { useState, useEffect } from 'react';
import ChatNavbarPatient from './ChatNavbarPatient';
import '../styles/chatbox.css'; // Import the CSS file for styling
import chatIcon from '../content/images/chatIcon.png'; // Import your chat icon image

function ChatBoxPatient() {
    const [showChatNavbarPatient, setShowChatNavbarPatient] = useState(false);
    const [bottomPosition, setBottomPosition] = useState(20);

  
    const handleChatButtonClick = () => {
      setShowChatNavbarPatient(!showChatNavbarPatient);

    };
  
    useEffect(() => {
      const handleScroll = () => {
        const scrolledHeight = window.scrollY;
        // Adjust the value as needed based on your layout
        const newPosition = 20 + scrolledHeight; 
        setBottomPosition(newPosition);
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

  
    return (
      <div className={`chat-box ${showChatNavbarPatient ? 'open' : ''}`} style={{ bottom: `${bottomPosition}px` }}>
        {/* Circular chat icon */}
        <img
          src={chatIcon}
          alt="Chat Icon"
          className="chat-icon"
          onClick={handleChatButtonClick}
        />
  
        {/* Conditional rendering of ChatNavbar based on state */}
        {showChatNavbarPatient && <ChatNavbarPatient/>}
      </div>
    );
  }
  
  export default ChatBoxPatient;
