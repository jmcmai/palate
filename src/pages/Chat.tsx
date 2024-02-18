import React, { useState, useRef, useEffect } from "react";
import Template from "../components/Template";
import "./Chat.css";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import useStoreUserEffect from "../useStoreUserEffect";

interface Message {
  role: string;
  content: string;
}

const Chat = () => {
  const userId = useStoreUserEffect();
  const user = useQuery(api.users.retrieveUserData);
  const sendToBot = useAction(api.messages.send);
  const answerFromBot = useAction(api.serve.answer);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setMessages(user.messageHistory);
    }
  }, [user]);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!userId) {
      return;
    }

    // Add user message
    sendToBot({ role: "user", content: inputText, userID: userId! });
    setInputText("");

    // Await reply from chatbot
    const reply = await answerFromBot({ userID: userId! });
    console.log(reply);
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Template>
      <main className="content-body">
        <div className="chat-history-container" ref={chatHistoryRef}>
          <div className="chat-history">
            {messages.map(
              (
                message: { role: string; content: string | null | undefined },
                index: React.Key | null | undefined
              ) => (
                <div key={index} className={`chat-bubble ${message.role}`}>
                  {message.role !== "system" && <span>{message.content}</span>}
                </div>
              )
            )}
          </div>
        </div>

        <form className="chat-input-container" onSubmit={handleMessageSubmit}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me for a recipe recommendation!"
            className="chat-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </main>
    </Template>
  );
};

export default Chat;
