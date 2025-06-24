import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/userSlice";

export default function RegisterForm({ onSuccess, onBackToLogin }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return;
    }

    try {
      await dispatch(registerUser({
        login: data.login,
        password: data.password,
        email: data.email,
        name: data.name
      })).unwrap();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Ошибка обрабатывается в Redux
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearError());
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" gutterBottom align="center">
        Регистрация
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
          required: "Логин обязателен для заполнения",
          minLength: {
            value: 3,
            message: "Логин должен содержать минимум 3 символа"
          }
        })}
        error={!!errors.login}
        helperText={errors.login?.message}
        disabled={loading}
      />

      <TextField
        label="Имя"
        fullWidth
        margin="normal"
        {...register("name", {
          required: "Имя обязательно для заполнения",
          minLength: {
            value: 2,
            message: "Имя должно содержать минимум 2 символа"
          }
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={loading}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        {...register("email", {
          required: "Email обязателен для заполнения",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Неверный формат email"
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={loading}
      />

      <TextField
        label="Пароль"
        type="password"
        fullWidth
        margin="normal"
        {...register("password", {
          required: "Пароль обязателен для заполнения",
          minLength: {
            value: 6,
            message: "Пароль должен содержать минимум 6 символов"
          }
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={loading}
      />

      <TextField
        label="Подтвердите пароль"
        type="password"
        fullWidth
        margin="normal"
        {...register("confirmPassword", {
          required: "Подтверждение пароля обязательно",
          validate: value => value === password || "Пароли не совпадают"
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        color="success"
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
        Зарегистрироваться
      </Button>

      <Typography sx={{ mt: 2 }} align="center">
        <Button
          onClick={handleBackToLogin}
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          Назад к входу
        </Button>
      </Typography>
    </Box>
  );
}
