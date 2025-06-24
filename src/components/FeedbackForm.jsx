import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addFeedback} from "../store/feedbackSlice";

export default function FeedbackForm({ onSuccess }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.feedback);
  const { currentUser } = useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(addFeedback({
        name: data.name,
        text: data.text,
        userId: currentUser?.id || null
      })).unwrap();

      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Поделитесь своим мнением о лабораторных работах
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Ваше имя"
        fullWidth
        margin="normal"
        defaultValue={currentUser?.name || ''}
        {...register("name", {
          required: "Имя обязательно для заполнения"
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={loading}
      />

      <TextField
        label="Ваш отзыв"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        placeholder="Расскажите, что вы думаете о курсе..."
        {...register("text", {
          required: "Текст отзыва обязателен для заполнения",
          minLength: {
            value: 10,
            message: "Отзыв должен содержать минимум 10 символов"
          }
        })}
        error={!!errors.text}
        helperText={errors.text?.message}
        disabled={loading}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
          Отправить отзыв
        </Button>

        {onSuccess && (
          <Button
            variant="outlined"
            onClick={onSuccess}
            disabled={loading}
          >
            Отменить
          </Button>
        )}
      </Box>
    </Box>
  );
}
