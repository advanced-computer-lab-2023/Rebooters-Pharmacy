// PharmacistRespondToDoc.js

import React, { useState, useEffect } from "react";
import moment from "moment";
import { Spinner } from "react-bootstrap"; // Import Spinner from react-bootstrap
import "../styles/ChatHistory.css"; // Import your CSS file for additional styling

const PharmacistRespondToDoc = () => {
  const [chats, setChats] = useState([]);
  const [messageContents, setMessageContents] = useState({});
  const [pollingInterval, setPollingInterval] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showChats, setShowChats] = useState(false);


  const fetchChats = async () => {
    try {
      
      const response = await fetch("/api/pharmacist/viewAllChatsToDoctor", {
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
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    // Fetch chats when the component mounts
    fetchChats();

    // Start polling for new messages every 5 seconds (adjust as needed)
    const interval = setInterval(() => {
      fetchChats();
    }, 1000);

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
      setChats(chats.map((chat) => (chat._id === chatId ? json : chat)));
      // Clear the content for the specific chatId
      setMessageContents({ ...messageContents, [chatId]: "" });
    } catch (error) {
      console.error("Error sending message to chat:", error);
    }
  };

  const handleViewDetails = (chatId) => {
    setSelectedChatId(chatId === selectedChatId ? null : chatId);
  };

  // Filter inactive chats
  const inactiveChats = chats.filter((chat) => chat.closed);

  return (
    <div className="card card-doc ">
      <div className="card-header bg-chat-text text-white">
        <h2>
          {showChats ? (
            <React.Fragment>
              Chat History..{" "}
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </React.Fragment>
          ) : (
            " All Chats History"
          )}
          {showChats && inactiveChats.length === 0 && (
            <p className="text font-weight-bold">There are no inactive chats</p>
          )}

          <button
            className="btn btn-secondary mt-2 ml-2 "
            style={{ marginLeft: "58px" }}
            onClick={() => setShowChats(!showChats)}
          >
            Toggle Chats
          </button>
        </h2>
      </div>
      {showChats && inactiveChats.length > 0 && (
        <div className="card-body chat-body12">
          {inactiveChats.map((chat) => (
            <div key={chat._id} className="mb-4">
              <h4 className="mb-3">
                Chat ID: {chat._id}
                <div>
                  <button
                    className="btn btn-primary ml-2"
                    onClick={() => handleViewDetails(chat._id)}
                  >
                    View Chat Details
                  </button>
                </div>
              </h4>
              {selectedChatId === chat._id && (
                <div>
                  {chat.messages.length > 0 &&
                    chat.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`message-box2 ${
                          message.userType === "pharmacist"
                            ? "pharmacist-message-box2"
                            : "doctor-message-box2"
                        }`}
                      >
                        <div className="message-content12">
                          <strong>{message.userType}: </strong>
                          {message.content}
                        </div>
                        <span className="text-muted timestamp12">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  {chat.closed ? (
                    <p></p>
                  ) : (
                    <div>
                      <textarea
                        rows="2"
                        className="form-control mt-3"
                        placeholder="Type your reply here..."
                        value={messageContents[chat._id] || ""}
                        onChange={(e) =>
                          setMessageContents({
                            ...messageContents,
                            [chat._id]: e.target.value,
                          })
                        }
                      ></textarea>
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => sendMessageToDoctor(chat._id)}
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PharmacistRespondToDoc;
