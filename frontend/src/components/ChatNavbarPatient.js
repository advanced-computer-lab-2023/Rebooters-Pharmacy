import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import PatientChats from "../components/PatientChats";


function ChatNavbarPatient() {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showPatientChats, setShowPatientChats] = useState(false);
    const [chats, setChats] = useState([]);

    const handleToggleOffcanvas = () => {
        setShowOffcanvas(!showOffcanvas);
      };

      
    const handleChatsWithPharmacistsClick = () => {
        // Toggle the state for "Chats with Patients"
        setShowPatientChats(!showPatientChats);
        // Call the parent component's function
        //onChatButtonClick("ChatsWithPatients");
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
                  <Button  type="button" variant="outline-primary" className="mb-2" onClick={() => handleChatsWithPharmacistsClick("ChatsWithPharmacists")}>
                    Chat with Pharmacist
                  </Button>
                  <div>
                  {showPatientChats &&   <PatientChats setChats={setChats} chats={chats} />}
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </Container>
        </nav>
      );  









}

export default ChatNavbarPatient;    