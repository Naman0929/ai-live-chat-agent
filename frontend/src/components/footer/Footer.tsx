import React from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#020617",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        mt: "auto",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 3,
          py: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "center", md: "flex-start" },
          gap: 3,
        }}
      >
        <Box textAlign={{ xs: "center", md: "left" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#14b8a6" }}
          >
            SupportIQ
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.65)", mt: 1, maxWidth: 300 }}
          >
            AI-powered customer support built for speed, scale, and clarity.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <FooterLink to="/login" label="Login" />
          <FooterLink to="/signup" label="Sign Up" />
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          py: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.5)" }}
        >
          © {new Date().getFullYear()} SupportIQ. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <MuiLink
    component={Link}
    to={to}
    underline="none"
    sx={{
      color: "rgba(255,255,255,0.7)",
      fontSize: 14,
      "&:hover": {
        color: "#14b8a6",
      },
    }}
  >
    {label}
  </MuiLink>
);

export default Footer;
