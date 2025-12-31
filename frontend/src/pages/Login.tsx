import React, { useEffect } from "react";
import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      toast.loading("Signing in...", { id: "login" });
      await auth?.login(email, password);
      toast.success("Welcome back!", { id: "login" });
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials", { id: "login" });
    }
  };

  useEffect(() => {
    if (auth?.user) navigate("/chat");
  }, [auth, navigate]);

  return (
    <Box
      width="100%"
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "radial-gradient(circle at top, #0f766e, #020617 70%)",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          backgroundColor: "#020617",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={700}
          mb={1}
          color="#14b8a6"
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "rgba(255,255,255,0.6)" }}
        >
          Sign in to continue to SupportIQ
        </Typography>

        <CustomizedInput type="email" name="email" label="Email" />
        <CustomizedInput type="password" name="password" label="Password" />

        <Button
          type="submit"
          fullWidth
          size="large"
          sx={{
            mt: 3,
            py: 1.2,
            borderRadius: 2,
            fontWeight: 600,
            backgroundColor: "#14b8a6",
            color: "#020617",
            "&:hover": {
              backgroundColor: "#0d9488",
            },
          }}
          endIcon={<IoIosLogIn />}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
