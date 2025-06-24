import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  Person,
  Email,
  Edit,
  Security,
  Notifications,
  History,
  Settings,
  CheckCircle
} from '@mui/icons-material';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import ProfileEditForm from '../components/ProfileEditForm';

const menuItems = [
  { icon: <Person />, title: 'Личная информация', description: 'Имя, email, контакты' },
  { icon: <Security />, title: 'Безопасность', description: 'Пароль, двухфакторная аутентификация' },
  { icon: <Notifications />, title: 'Уведомления', description: 'Email и push уведомления' },
  { icon: <History />, title: 'История активности', description: 'Журнал входов и действий' }
];

const achievements = [
  { title: 'Первые шаги', description: 'Завершена первая лабораторная', date: '2024-01-15' },
  { title: 'API Мастер', description: 'Реализована работа с REST API', date: '2024-02-20' },
  { title: 'UI Дизайнер', description: 'Создан адаптивный интерфейс', date: '2024-03-10' }
];

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Для просмотра профиля необходимо войти в систему
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: isMobile ? 10 : 4 }}>
      <Typography variant="h4" gutterBottom>
        Профиль пользователя
      </Typography>

      <Grid container spacing={4}>
        {/* Основная информация */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
            >
              {currentUser?.name?.charAt(0)?.toUpperCase() ||
               currentUser?.login?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>

            <Typography variant="h5" gutterBottom>
              {currentUser?.name || 'Не указано'}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              @{currentUser?.login}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentUser?.email || 'Email не указан'}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                size="small"
              >
                Редактировать
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                size="small"
              >
                Выйти
              </Button>
            </Box>
          </Card>

          {/* Статистика */}
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              📊 Статистика
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Лабораторных выполнено"
                  secondary="10 из 10"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Дата регистрации"
                  secondary={currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Последнее обновление"
                  secondary={currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>

        {/* Детальная информация */}
        <Grid item xs={12} md={8}>
          {!isEditing ? (
            <>
              {/* Настройки профиля */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ⚙️ Настройки профиля
                  </Typography>

                  <List>
                    {menuItems.map((item, index) => (
                      <ListItem
                        key={index}
                        button
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={item.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Достижения */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🏆 Достижения
                  </Typography>

                  {achievements.map((achievement, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'success.light',
                        color: 'success.contrastText'
                      }}
                    >
                      <CheckCircle sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2">
                          {achievement.description}
                        </Typography>
                        <Typography variant="caption">
                          {new Date(achievement.date).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Редактирование профиля
                </Typography>
                <ProfileEditForm onCancel={() => setIsEditing(false)} />
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
