import { useForm } from "react-hook-form";
import { TextField, Button, Box, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, clearError } from "../store/userSlice";
import { useEffect } from "react";

export default function ProfileEditForm({ onCancel }) {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
    }
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUser({
        id: currentUser.id,
        userData: data
      })).unwrap();

      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      // Ошибка обрабатывается в Redux
    }
  };

  const handleCancel = () => {
    dispatch(clearError());
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ position: 'relative' }}
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
          Сохранить
        </Button>

        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={loading}
        >
          Отменить
        </Button>
      </Box>
    </Box>
  );
}
