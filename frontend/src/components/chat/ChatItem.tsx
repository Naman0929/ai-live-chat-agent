import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string): string[] {
  return message.includes("```") ? message.split("```") : [message];
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const auth = useAuth();
  const messageBlocks = extractCodeFromString(content);

  return (
    <Box
      sx={{
        display: "flex",
        p: 2,
        gap: 2,
        borderRadius: 2,
        my: 1,
        bgcolor: role === "assistant" ? "#004d5612" : "#004d56",
      }}
    >
      {role === "user" && (
        <Avatar sx={{ bgcolor: "black", color: "white" }}>
          {auth?.user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")}
        </Avatar>
      )}

      <Box sx={{ flex: 1, wordBreak: "break-word" }}>
        {messageBlocks.map((block, idx) =>
          block.trim() === "" ? null : idx % 2 === 1 ? (
            <SyntaxHighlighter
              key={idx}
              style={coldarkDark}
              language="javascript"
              customStyle={{ borderRadius: 8, padding: 12 }}
            >
              {block}
            </SyntaxHighlighter>
          ) : (
            <Typography
              key={idx}
              sx={{
                fontSize: "20px",
                color: "white",
              }}
            >
              {block}
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;
