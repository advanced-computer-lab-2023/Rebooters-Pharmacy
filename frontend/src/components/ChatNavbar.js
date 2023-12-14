// ChatNavbar.js
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

function ChatNavbar({ onChatButtonClick }) {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  return (
    <nav className="bg-body-tertiary mb-3 flex-column navbar navbar-light">
      <Container fluid>
        <Navbar.Brand href="#">Chats</Navbar.Brand>
        <button
          aria-controls="offcanvasNavbar"
          type="button"
          aria-label="Toggle navigation"
          className="navbar-toggler collapsed"
          onClick={handleToggleOffcanvas}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
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
              <Button  type="button" variant="outline-primary" className="mb-2" onClick={() => onChatButtonClick("ChatsWithPatients")}>
                Chats with Patients
              </Button>
              <Button type="button" variant="outline-secondary" className="mb-2" onClick={() => onChatButtonClick("StartChatwithaDoctor")}>
                Start Chat with a Doctor
              </Button>
              <Button type="button" variant="outline-info" className="mb-2"  onClick={() => onChatButtonClick("ChatWithaDoctor")}>
                Chat With a Doctor
              </Button>
              <Button type="button" variant="outline-danger" className="mb-2" onClick={() => onChatButtonClick("History")}>
                Chat History
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </nav>
  );
}

export default ChatNavbar;
