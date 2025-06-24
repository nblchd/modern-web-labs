import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Code,
  Assignment,
  Api,
  Palette,
  CheckCircle,
  TrendingUp,
  School,
  Timeline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const featuredLabs = [
  {
    id: 6,
    title: 'REST API интеграция',
    description: 'Работа с сервером, HTTP запросы, промисы JavaScript',
    icon: <Api />,
    color: 'error',
    status: 'Завершено'
  },
  {
    id: 7,
    title: 'UI Kit & Адаптивность',
    description: 'Material-UI, responsive design, современный интерфейс',
    icon: <Palette />,
    color: 'primary',
    status: 'Текущая'
  }
];

const achievements = [
  { label: 'Лабораторных выполнено', value: '10', icon: <Assignment /> },
  { label: 'Компонентов создано', value: '25+', icon: <Code /> },
  { label: 'API endpoints', value: '8', icon: <Api /> },
];

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: isMobile ? 10 : 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          ССРВП Лабораторные работы
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
        >
          Курс по современным средствам разработки веб-приложений с использованием React, Redux и Material-UI
        </Typography>

        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {currentUser?.name?.charAt(0) || currentUser?.login?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="body1">
              Добро пожаловать, {currentUser?.name || currentUser?.login}!
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/lab/7')}
          sx={{ mr: 2 }}
        >
          Текущая лабораторная
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/about')}
        >
          Узнать больше
        </Button>
      </Box>

      {/* Статистика */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {achievements.map((achievement, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`
              }}
            >
              <Box sx={{ color: 'primary.main', mb: 1 }}>
                {achievement.icon}
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {achievement.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {achievement.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Рекомендуемые лабораторные */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        🔥 Рекомендуемые лабораторные
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {featuredLabs.map((lab) => (
          <Grid item xs={12} md={6} key={lab.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${lab.color}.main`, mr: 2 }}>
                    {lab.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3">
                      Лабораторная {lab.id}
                    </Typography>
                    <Chip
                      label={lab.status}
                      color={lab.status === 'Текущая' ? 'primary' : 'success'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {lab.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lab.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color={lab.color}
                  onClick={() => navigate(`/lab/${lab.id}`)}
                >
                  Открыть
                </Button>
                <Button size="small">
                  Подробнее
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Прогресс обучения */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School color="primary" />
                Прогресс обучения
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Основы React" secondary="Компоненты, состояние, события" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Маршрутизация" secondary="React Router" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Redux & API" secondary="Управление состоянием" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="UI Kit" secondary="Material-UI, адаптивность" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline color="primary" />
                Технологии
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['React', 'Redux Toolkit', 'Material-UI', 'React Router', 'React Hook Form', 'Express.js', 'REST API', 'JavaScript ES6+'].map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Современный стек технологий для разработки веб-приложений
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
