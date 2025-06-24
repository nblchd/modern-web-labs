import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
  Alert,
  Button
} from '@mui/material';
import {
  Palette,
  PhoneAndroid,
  Menu as MenuIcon,
  Navigation,
  TouchApp,
  DevicesOther,
  CheckCircle,
  Lightbulb
} from '@mui/icons-material';

const features = [
  {
    title: 'Material-UI Kit',
    description: 'Полная интеграция компонентной библиотеки Material-UI',
    icon: <Palette />,
    status: 'Реализовано'
  },
  {
    title: 'Адаптивный дизайн',
    description: 'Responsive breakpoints для всех устройств',
    icon: <PhoneAndroid />,
    status: 'Реализовано'
  },
  {
    title: 'Навигационный Drawer',
    description: 'Скрываемое боковое меню с лабораторными работами',
    icon: <MenuIcon />,
    status: 'Реализовано'
  },
  {
    title: 'Нижняя навигация',
    description: 'Быстрые действия и FAB для мобильных устройств',
    icon: <TouchApp />,
    status: 'Реализовано'
  }
];

const responsiveFeatures = [
  'Автоматическая адаптация под размер экрана',
  'Скрытие/показ элементов на мобильных устройствах',
  'Touch-friendly интерфейс для сенсорных экранов',
  'Оптимизированная навигация для разных устройств',
  'Использование Material-UI breakpoints',
  'Flexible Grid Layout системы'
];

export default function Lab7() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: isMobile ? 10 : 4 }}>
      {/* Заголовок */}
      <Typography variant="h4" gutterBottom>
        Лабораторная работа №7
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        UI Kit Material-UI и адаптивный дизайн
      </Typography>

      {/* Информация о текущем устройстве */}
      <Alert
        severity="info"
        sx={{ mb: 4 }}
        icon={<DevicesOther />}
      >
        <Typography variant="body2">
          <strong>Текущий режим:</strong> {' '}
          {isMobile ? '📱 Мобильное устройство' : isTablet ? '📟 Планшет' : '💻 Десктоп'}
          {' '}({window.innerWidth}px × {window.innerHeight}px)
        </Typography>
      </Alert>

      {/* Основные возможности */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        🎨 Реализованные возможности
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2, fontSize: '2.5rem' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Chip
                  label={feature.status}
                  color="success"
                  size="small"
                  icon={<CheckCircle />}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Навигационные компоненты */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Navigation color="primary" />
                Header с навигацией
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Адаптивная навигация"
                    secondary="Разные меню для мобильных и десктопа"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Переключатель темы"
                    secondary="Светлая/темная тема в Header"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Профиль пользователя"
                    secondary="Выпадающее меню с аватаром"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuIcon color="primary" />
                Responsive Drawer
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Скрываемое меню"
                    secondary="Открывается по кнопке на мобильных"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Список лабораторных"
                    secondary="Красивые карточки с описанием"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Индикация активной страницы"
                    secondary="Подсветка текущей лабораторной"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Адаптивные возможности */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DevicesOther color="primary" />
          Адаптивные возможности
        </Typography>

        <Grid container spacing={2}>
          {responsiveFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="body2">{feature}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Технические детали */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lightbulb color="primary" />
            Технические решения
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>Material-UI Theme:</strong> Использована единая система дизайна с кастомной темой,
            поддерживающей светлый и темный режимы.
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>Responsive Breakpoints:</strong> Применены стандартные точки перелома Material-UI
            (xs, sm, md, lg, xl) для адаптации под разные устройства.
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>Navigation Pattern:</strong> Реализован паттерн адаптивной навигации -
            постоянная навигация на десктопе, скрываемый drawer на мобильных.
          </Typography>

          <Typography variant="body2">
            <strong>Bottom Navigation:</strong> Дополнительная навигация внизу экрана для
            мобильных устройств с FAB для быстрых действий.
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['Material-UI', 'Responsive Design', 'React Hooks', 'useMediaQuery', 'Theme Provider', 'CSS-in-JS'].map((tech) => (
              <Chip
                key={tech}
                label={tech}
                variant="outlined"
                color="primary"
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

    </Container>
  );
}
