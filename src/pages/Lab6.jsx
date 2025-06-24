import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  Chip
} from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Person, Feedback, Api } from "@mui/icons-material";
import LoginForm from "../components/LoginForm.jsx";
import FeedbackForm from "../components/FeedbackForm.jsx";
import FeedbackList from "../components/FeedbackList.jsx";
import ProfileEditForm from "../components/ProfileEditForm.jsx";
import { logout } from "../store/userSlice";

export default function Lab6() {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [authTrigger, setAuthTrigger] = useState(false);

  const handleLogin = () => {
    setAuthTrigger(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAuthTrigger(false);
    setIsEditingProfile(false);
  };

  if (!isAuthenticated && !authTrigger) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Лабораторная работа №6
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        REST API интеграция с промисами JavaScript
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Api sx={{ mr: 1 }} />
              <Typography variant="h6">
                API Функциональность
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="GET запросы" color="success" size="small" />
              <Chip label="POST запросы" color="success" size="small" />
              <Chip label="PUT запросы" color="success" size="small" />
              <Chip label="DELETE запросы" color="success" size="small" />
              <Chip label="Redux оптимизация" color="primary" size="small" />
              <Chip label="Промисы (fetch)" color="info" size="small" />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Профиль пользователя */}
      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Профиль пользователя
                </Typography>
              </Box>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Выйти
              </Button>
            </Box>

            {!isEditingProfile ? (
              <Box>
                <Typography variant="body1">
                  <strong>Логин:</strong> {currentUser?.login}
                </Typography>
                <Typography variant="body1">
                  <strong>Имя:</strong> {currentUser?.name || 'Не указано'}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {currentUser?.email || 'Не указан'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {currentUser?.id}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Редактировать профиль
                  </Button>
                </Box>
              </Box>
            ) : (
              <ProfileEditForm onCancel={() => setIsEditingProfile(false)} />
            )}
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Система отзывов */}
      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Feedback sx={{ mr: 1 }} />
              <Typography variant="h6">
                Система обратной связи
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Добавляйте отзывы через API. Вы можете удалять только свои отзывы.
            </Typography>

            {/* Форма обратной связи */}
            <Typography variant="h6" gutterBottom>📩 Оставить отзыв</Typography>
            <FeedbackForm />

            <Divider sx={{ my: 3 }} />

            {/* Список отзывов */}
            <FeedbackList />
          </CardContent>
        </Card>
      </Box>

    </Container>
  );
}
