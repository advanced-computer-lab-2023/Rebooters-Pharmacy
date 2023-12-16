// ChatNavbar.js
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import PharmacistChats from './PharmacistChats';
import PharmacistRespondToDoc from './PharmacistRespondToDoc';
import Pharmacist_DoctorChats from './Pharmacist_DoctorChats';
import ChatWithDoctor from './ChatWithDoctor';



function ChatNavbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showPharmacistChats, setShowPharmacistChats] = useState(false);
  const [showHistoryChats, setShowHistoryChats] = useState(false);
  const [showPharm_DocChats, setShowPharm_DocChats] = useState(false);
  const [showChatwithDoctorChats, setShowChatwithDoctorChats] = useState(false);




  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const handleChatsWithPatientsClick = () => {
    // Toggle the state for "Chats with Patients"
    setShowPharmacistChats(!showPharmacistChats);
    // Call the parent component's function
    //onChatButtonClick("ChatsWithPatients");
  };

  const handleHistoryClick = () => {
    // Toggle the state for "Chat History"
    setShowHistoryChats(!showHistoryChats);
    // Call the parent component's function
   // onChatButtonClick("History");
  };

  const handlePharm_DocClick = () => {
    // Toggle the state for "Chat History"
    setShowPharm_DocChats(!showPharm_DocChats);
    // Call the parent component's function
    //onChatButtonClick("StartChatwithaDoctor");
  };

  const handleChatDoctorClick = () => {
    // Toggle the state for "Chat History"
    setShowChatwithDoctorChats(!showChatwithDoctorChats);
  
  };


  return (
    <nav className="bg-body-tertiary mb-3 flex-column navbar navbar-light">
      <Container fluid>
        <button
          aria-controls="offcanvasNavbar"
          type="button"
          aria-label="Toggle navigation"
          className="navbar-toggler collapsed"
          onClick={handleToggleOffcanvas}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Navbar.Brand href="#">Chats</Navbar.Brand>
        <Offcanvas
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="end"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Choose Your Chat</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex flex-column">
              <Button  type="button" variant="outline-primary" className="mb-2" onClick={() => handleChatsWithPatientsClick("ChatsWithPatients")}>
                Chats with Patients
              </Button>
              <Button type="button" variant="outline-secondary" className="mb-2" onClick={() => handlePharm_DocClick("StartChatwithaDoctor")}>
                Start Chat with a Doctor
              </Button>
              <Button type="button" variant="outline-info" className="mb-2"  onClick={() => handleChatDoctorClick("ChatWithaDoctor")}>
                Chat With a Doctor
              </Button>
              <Button type="button" variant="outline-danger" className="mb-2" onClick={() => handleHistoryClick("History")}>
                Chat History
              </Button>
              <div>
              {showPharmacistChats && <PharmacistChats />}
              </div>
              <div>
              {showHistoryChats && <PharmacistRespondToDoc />}
              </div>
              <div>
              {showPharm_DocChats && <Pharmacist_DoctorChats />}
              </div>
              <div>
              {showChatwithDoctorChats && <ChatWithDoctor />}
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </nav>
  );
}

export default ChatNavbar;
