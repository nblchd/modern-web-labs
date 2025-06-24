import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Dashboard,
  People,
  Feedback,
  CheckCircle,
  Block,
  MoreVert,
  AdminPanelSettings,
  TableChart,
  Analytics,
  Security
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:3001/api";

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Состояние данных
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalFeedbacks: 0,
    activeFeedbacks: 0,
    pendingFeedbacks: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Проверка прав доступа
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" icon={<Security />}>
          <Typography variant="h6" gutterBottom>
            Доступ запрещен
          </Typography>
          <Typography>
            Для доступа к панели администрирования требуются права администратора.
          </Typography>
        </Alert>
      </Container>
    );
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Загружаем статистику пользователей
      const usersResponse = await fetch(`${API_URL}/users/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          page: 1,
          limit: 5,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }),
      });

      // Загружаем статистику отзывов
      const feedbacksResponse = await fetch(`${API_URL}/feedbacks/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          page: 1,
          limit: 5,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }),
      });

      if (usersResponse.ok && feedbacksResponse.ok) {
        const usersData = await usersResponse.json();
        const feedbacksData = await feedbacksResponse.json();

        // Подсчитываем статистику
        const totalUsers = usersData.total;
        const activeUsers = usersData.data.filter(u => u.status === 'active').length;
        const blockedUsers = usersData.data.filter(u => u.status === 'blocked').length;

        const totalFeedbacks = feedbacksData.total;
        const activeFeedbacks = feedbacksData.data.filter(f => f.status === 'active').length;
        const pendingFeedbacks = feedbacksData.data.filter(f => f.status === 'pending').length;

        setStats({
          totalUsers,
          activeUsers,
          blockedUsers,
          totalFeedbacks,
          activeFeedbacks,
          pendingFeedbacks
        });

        setRecentUsers(usersData.data.slice(0, 5));
        setRecentFeedbacks(feedbacksData.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const quickActions = [
    {
      title: 'Управление пользователями',
      description: 'Просмотр, редактирование и управление учетными записями',
      icon: <People />,
      color: 'primary',
      path: '/admin/users',
      count: stats.totalUsers
    },
    {
      title: 'Модерация отзывов',
      description: 'Управление отзывами и обратной связью',
      icon: <Feedback />,
      color: 'secondary',
      path: '/admin/feedbacks',
      count: stats.totalFeedbacks
    },
    {
      title: 'Системная аналитика',
      description: 'Статистика использования и производительности',
      icon: <Analytics />,
      color: 'info',
      path: '/admin/analytics',
      count: null,
      disabled: true
    },
    {
      title: 'Управление таблицами',
      description: 'Настройка и тестирование React Table',
      icon: <TableChart />,
      color: 'success',
      path: '/lab/8',
      count: null
    }
  ];

  const statisticsCards = [
    {
      title: 'Всего пользователей',
      value: stats.totalUsers,
      icon: <People />,
      color: 'primary',
      subtitle: `${stats.activeUsers} активных`
    },
    {
      title: 'Активные пользователи',
      value: stats.activeUsers,
      icon: <CheckCircle />,
      color: 'success',
      subtitle: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% от общего числа`
    },
    {
      title: 'Заблокированные',
      value: stats.blockedUsers,
      icon: <Block />,
      color: 'error',
      subtitle: `${((stats.blockedUsers / stats.totalUsers) * 100).toFixed(1)}% от общего числа`
    },
    {
      title: 'Отзывы',
      value: stats.totalFeedbacks,
      icon: <Feedback />,
      color: 'info',
      subtitle: `${stats.pendingFeedbacks} на модерации`
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: isMobile ? 10 : 4 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminPanelSettings color="primary" />
          Панель администрирования
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Добро пожаловать, {currentUser.name}! Управление системой и пользователями.
        </Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 4 }} />}

      {/* Статистика */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statisticsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette[card.color].light}20, ${theme.palette[card.color].main}10)`
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ color: `${card.color}.main` }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h4" color={`${card.color}.main`} fontWeight="bold">
                    {card.value}
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Быстрые действия */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Dashboard />
                Быстрые действия
              </Typography>

              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        cursor: action.disabled ? 'not-allowed' : 'pointer',
                        opacity: action.disabled ? 0.6 : 1,
                        transition: 'all 0.2s',
                        '&:hover': action.disabled ? {} : {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => !action.disabled && navigate(action.path)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ color: `${action.color}.main` }}>
                          {action.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {action.title}
                          </Typography>
                          {action.count !== null && (
                            <Chip
                              label={action.count}
                              size="small"
                              color={action.color}
                              variant="outlined"
                            />
                          )}
                        </Box>
                        {action.disabled && (
                          <Chip label="Скоро" size="small" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Последние пользователи */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People />
                  Новые пользователи
                </Typography>
                <Button size="small" onClick={() => navigate('/admin/users')}>
                  Все
                </Button>
              </Box>

              <List dense>
                {recentUsers.map((user, index) => (
                  <ListItem
                    key={user.id}
                    secondaryAction={
                      <IconButton size="small" onClick={() => navigate('/admin/users')}>
                        <MoreVert />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: `${user.role === 'admin' ? 'error' : 'primary'}.main`
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user.name}
                          {user.role === 'admin' && (
                            <Chip label="Admin" size="small" color="error" />
                          )}
                        </Box>
                      }
                      secondary={formatDate(user.createdAt)}
                    />
                  </ListItem>
                ))}
              </List>

              {recentUsers.length === 0 && !loading && (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                  Нет новых пользователей
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Последние отзывы */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Feedback />
                  Последние отзывы
                </Typography>
                <Button size="small" onClick={() => navigate('/admin/feedbacks')}>
                  Все отзывы
                </Button>
              </Box>

              <List>
                {recentFeedbacks.map((feedback, index) => (
                  <ListItem
                    key={feedback.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={feedback.status === 'active' ? 'Активен' : 'На модерации'}
                          size="small"
                          color={feedback.status === 'active' ? 'success' : 'warning'}
                        />
                        <IconButton size="small" onClick={() => navigate('/admin/feedbacks')}>
                          <MoreVert />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" noWrap>
                          {feedback.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 0.5 }}>
                            {feedback.message.length > 100
                              ? `${feedback.message.substring(0, 100)}...`
                              : feedback.message
                            }
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(feedback.createdAt)} • {feedback.email}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              {recentFeedbacks.length === 0 && !loading && (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                  Нет отзывов
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Информационные блоки */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Alert severity="info" icon={<TableChart />}>
            <Typography variant="subtitle2" gutterBottom>
              React Table функционал
            </Typography>
            <Typography variant="body2">
              Система использует @tanstack/react-table с поддержкой виртуализации,
              drag&drop колонок и адаптивного дизайна для мобильных устройств.
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12} md={6}>
          <Alert severity="success" icon={<Security />}>
            <Typography variant="subtitle2" gutterBottom>
              Безопасность системы
            </Typography>
            <Typography variant="body2">
              Реализована ролевая система доступа с серверной проверкой прав.
              Все административные функции защищены авторизацией.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
}
