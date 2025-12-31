import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const content = inputRef.current?.value?.trim();
    if (!content || loading) return;

    if (inputRef.current) inputRef.current.value = "";

    const userMessage: Message = { role: "user", content };
    const assistantPlaceholder: Message = { role: "assistant", content: "..." };

    setChatMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setLoading(true);

    try {
      const chatData = await sendChatRequest(content);
      setChatMessages(chatData.chats);
    } catch (err) {
      console.error(err);
      toast.error("Failed to get response from AI");
      setChatMessages((prev) => prev.filter((m) => m.content !== "..."));
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      getUserChats()
        .then((data) => setChatMessages(data.chats))
        .catch(() => toast.error("Failed to load chats"));
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) navigate("/login");
  }, [auth, navigate]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatMessages]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(circle at top, #0f766e, #020617 70%)",
        px: { xs: 1, md: 3 },
        py: 2,
      }}
    >
      {/* Chat Area */}
      <Box
        ref={chatBoxRef}
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          borderRadius: 3,
          p: 2,
          overflowY: "auto",
          backgroundColor: "rgba(2,6,23,0.6)",
        }}
      >
        {chatMessages.map((chat, index) => (
          <ChatItem key={index} role={chat.role} content={chat.content} />
        ))}
      </Box>

      {/* Input Box */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mt: 2,
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgb(17,27,39)",
          borderRadius: 3,
          px: 2,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "18px",
            padding: "20px",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <IconButton
          onClick={handleSubmit}
          disabled={loading}
          sx={{ color: "#14b8a6" }}
        >
          <IoMdSend />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
