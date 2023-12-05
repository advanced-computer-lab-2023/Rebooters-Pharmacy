import React, { useState, useEffect } from "react";

const PharmacistRespondToDoc = () => {
  const [chats, setChats] = useState([]);
  const [messageContents, setMessageContents] = useState({});
  const [pollingInterval, setPollingInterval] = useState(null);


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
      setChats(
        chats.map((chat) => (chat._id === chatId ? json : chat))
      );
      // Clear the content for the specific chatId
      setMessageContents({ ...messageContents, [chatId]: "" });
    } catch (error) {
      console.error("Error sending message to chat:", error);
    }
  };

  return (
    <div className="card">
      <h2 className="card-header">All Chats</h2>
      {chats.length === 0 ? (
        <p>There are no chats</p>
      ) : (
        <div>
          {chats.map((chat) => (
            <div key={chat._id}>
              <h4>Chat ID: {chat._id}</h4>
              <div>
                {chat.messages.length > 0 &&
                  chat.messages.map((message, index) => (
                    <div key={index}>
                      <strong>{message.userType}: </strong> {message.content}
                      <span style={{ marginLeft: "10px", color: "gray" }}>
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
              {chat.closed ? (
                <p>This chat is closed.</p>
              ) : (
                <div>
                  <textarea
                    rows="1"
                    cols="25"
                    placeholder="Type your reply here..."
                    value={messageContents[chat._id] || ""}
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
                  >
                    Send
                  </button>
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
