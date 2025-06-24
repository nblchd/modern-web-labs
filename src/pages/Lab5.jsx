import {
  Container,
  Typography,
} from "@mui/material";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import FeedbackForm from "../components/FeedbackForm.jsx";
import FeedbackList from "../components/FeedbackList.jsx";

export default function Lab5() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Лабораторная работа №5
      </Typography>

      <Typography variant="h6" gutterBottom>📝 Форма регистрации</Typography>
      <RegisterForm/>

      <Typography variant="h6" gutterBottom>🔐 Форма авторизации</Typography>
      <LoginForm/>

      {/* Форма обратной связи */}
      <Typography variant="h6" gutterBottom>📩 Оставить отзыв</Typography>
      <FeedbackForm/>

      {/* Список отзывов */}
      <FeedbackList/>
    </Container>
  );
}
