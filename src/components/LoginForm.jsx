import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/userSlice";
import RegisterForm from "./RegisterForm";

export default function LoginForm({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      if (onLogin) {
        onLogin();
      }
    } catch (error) {
      // Ошибка обрабатывается в Redux
    }
  };

  const handleRegisterSuccess = () => {
    setIsRegistering(false);
    reset();
  };

  const handleSwitchToRegister = () => {
    dispatch(clearError());
    setIsRegistering(true);
  };

  const handleSwitchToLogin = () => {
    dispatch(clearError());
    setIsRegistering(false);
  };

  if (isRegistering) {
    return (
      <Container maxWidth="xs" sx={{ mt: 5 }}>
        <RegisterForm
          onSuccess={handleRegisterSuccess}
          onBackToLogin={handleSwitchToLogin}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 5 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Вход в систему
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Логин"
          fullWidth
          margin="normal"
          {...register("login", {
            required: "Логин обязателен для заполнения"
          })}
          error={!!errors.login}
          helperText={errors.login?.message}
          disabled={loading}
        />

        <TextField
          label="Пароль"
          type="password"
          fullWidth
          margin="normal"
          {...register("password", {
            required: "Пароль обязателен для заполнения"
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, position: 'relative' }}
          disabled={loading}
        >
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
          Войти
        </Button>

        <Typography sx={{ mt: 2 }} align="center">
          <Button
            onClick={handleSwitchToRegister}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            Нет аккаунта? Зарегистрируйтесь
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}
