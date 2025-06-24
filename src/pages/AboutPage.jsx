import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import {
  Person,
  School,
  Code,
  Email,
  GitHub,
  LinkedIn,
  Star,
  TrendingUp,
  EmojiEvents,
  Timeline
} from '@mui/icons-material';

const skills = [
  { name: 'React', level: 85, color: 'primary' },
  { name: 'JavaScript', level: 90, color: 'warning' },
  { name: 'Redux', level: 80, color: 'secondary' },
  { name: 'Material-UI', level: 85, color: 'info' },
  { name: 'Node.js', level: 75, color: 'success' },
  { name: 'REST API', level: 80, color: 'error' }
];

const projects = [
  {
    title: 'Система управления лабораторными',
    description: 'React приложение с Redux, Material-UI и REST API',
    technologies: ['React', 'Redux', 'Material-UI', 'Express.js'],
    status: 'В разработке'
  },
  {
    title: 'Адаптивный веб-интерфейс',
    description: 'Responsive design с использованием современных подходов',
    technologies: ['React', 'Material-UI', 'CSS Grid', 'Flexbox'],
    status: 'Завершен'
  }
];

export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: isMobile ? 10 : 4 }}>
      {/* Заголовок */}
      <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
        О разработчике
      </Typography>

      {/* Основная информация */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
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
              👨‍💻
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Студент ССРВП
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Frontend Developer
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
              <Button variant="outlined" startIcon={<Email />} size="small">
                Email
              </Button>
              <Button variant="outlined" startIcon={<GitHub />} size="small">
                GitHub
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              Обо мне
            </Typography>

            <Typography variant="body1" paragraph>
              Изучаю современные технологии веб-разработки в рамках курса "Современные средства разработки веб-приложений".
              Активно осваиваю React экосистему, включая Redux для управления состоянием, Material-UI для создания
              современных интерфейсов и REST API для взаимодействия с сервером.
            </Typography>

            <Typography variant="body1" paragraph>
              В процессе обучения реализовал 10 лабораторных работ, каждая из которых демонстрирует различные
              аспекты современной frontend разработки - от базовых концепций React до создания полноценных
              адаптивных приложений.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School color="primary" />
              Образование
            </Typography>

            <Typography variant="body1">
              Курс "Современные средства разработки веб-приложений"
            </Typography>
            <Typography variant="body2" color="text.secondary">
              React, Redux, Material-UI, REST API
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Навыки */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Code color="primary" />
          Технические навыки
        </Typography>

        <Grid container spacing={3}>
          {skills.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill.name}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{skill.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {skill.level}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={skill.level}
                  color={skill.color}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Проекты */}
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <EmojiEvents color="primary" />
        Проекты
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {project.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                {project.technologies.map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>

              <Chip
                label={project.status}
                color={project.status === 'Завершен' ? 'success' : 'warning'}
                size="small"
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Достижения */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline color="primary" />
          Прогресс в обучении
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <Star color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="10 лабораторных работ"
              secondary="Полный цикл изучения React экосистемы"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Создание адаптивных интерфейсов"
              secondary="Использование Material-UI и responsive design"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Code color="info" />
            </ListItemIcon>
            <ListItemText
              primary="REST API интеграция"
              secondary="Работа с серверным API и управление состоянием"
            />
          </ListItem>
        </List>
      </Card>
    </Container>
  );
}
