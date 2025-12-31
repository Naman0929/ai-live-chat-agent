import { Box, Typography, Button, useTheme } from "@mui/material";
import React from "react";
import TypingAnim from "../components/typer/TypingAnim";
import Footer from "../components/footer/Footer";

const Home = () => {
  const theme = useTheme();

  return (
    <Box width="100%" minHeight="100vh" display="flex" flexDirection="column">
      
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
          background: "radial-gradient(circle at top, #0f766e, #020617 70%)",
        }}
      >
        <TypingAnim />

        <Typography
          variant="h6"
          sx={{
            mt: 2,
            maxWidth: 600,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          AI-powered customer support that responds instantly, understands
          context, and scales with your business.
        </Typography>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
