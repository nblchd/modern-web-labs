import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Alert,
  Button,
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  TableChart,
  AdminPanelSettings,
  People,
  Feedback,
  Security,
  ViewColumn,
  DragIndicator,
  CheckCircle,
  Speed,
  PlayArrow,
  Code,
  DataArray,
  TouchApp,
  PhoneAndroid
} from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReadOnlyFeedbackList from '../components/ReadOnlyFeedbackList';
import AdvancedDataTable from '../components/AdvancedDataTable';

// Демонстрационные данные для таблицы
const generateDemoData = (count = 20) => {
  const names = ['Алексей', 'Мария', 'Иван', 'Елена', 'Дмитрий', 'Анна', 'Сергей', 'Ольга'];
  const surnames = ['Доде', 'Артмане', 'Зощнко', 'Фурье', 'Лансере', 'Морозов', 'Клименко', 'Соколович'];
  const domains = ['gmail.com', 'yandex.ru', 'mail.ru', 'outlook.com'];
  const roles = ['user', 'user', 'user', 'admin'];
  const statuses = ['active', 'active', 'active', 'blocked'];

  return Array.from({ length: count }, (_, i) => {
    const name = names[Math.floor(Math.random() * names.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    return {
      id: i + 1,
      name: `${name} ${surname}`,
      email: `${name.toLowerCase()}${i}@${domains[Math.floor(Math.random() * domains.length)]}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

const features = [
  {
    title: 'React Table (@tanstack)',
    description: 'Мощная библиотека таблиц с серверной пагинацией и сортировкой',
    icon: <TableChart />,
    status: 'Реализовано',
    color: 'primary',
    details: ['Серверная пагинация', 'Множественная сортировка', 'Глобальный поиск', 'Фильтрация по колонкам']
  },
  {
    title: 'Система ролей',
    description: 'Разделение прав доступа между администраторами и пользователями',
    icon: <Security />,
    status: 'Реализовано',
    color: 'success',
    details: ['Роль Admin (полный доступ)', 'Роль User (ограниченный доступ)', 'Серверная проверка прав', 'Защищенные маршруты']
  },
  {
    title: 'Админ панель',
    description: 'Полноценная система администрирования с дашбордом',
    icon: <AdminPanelSettings />,
    status: 'Реализовано',
    color: 'secondary',
    details: ['Dashboard со статистикой', 'Управление пользователями', 'Модерация отзывов', 'Массовые операции']
  },
  {
    title: 'Drag & Drop',
    description: 'Перетаскивание колонок с помощью @dnd-kit',
    icon: <DragIndicator />,
    status: 'Реализовано',
    color: 'info',
    details: ['Перетаскивание колонок', 'Настройка видимости', 'Сохранение порядка', 'Контекстные меню']
  },
  {
    title: 'Виртуализация',
    description: 'Оптимизация для больших объемов данных',
    icon: <Speed />,
    status: 'Реализовано',
    color: 'warning',
    details: ['React Virtual', 'Ленивая загрузка', 'Оптимизация памяти', 'Плавная прокрутка']
  },
  {
    title: 'Мобильная адаптация',
    description: 'Специальная оптимизация для мобильных устройств',
    icon: <PhoneAndroid />,
    status: 'Реализовано',
    color: 'error',
    details: ['Фиксированная первая колонка', 'Горизонтальная прокрутка', 'Touch-friendly интерфейс', 'Адаптивные размеры']
  }
];

const adminFeatures = [
  'Полная таблица пользователей с редактированием',
  'Блокировка, разблокировка и удаление пользователей',
  'Система модерации отзывов',
  'Массовые операции выбранных элементов',
  'Продвинутый поиск и множественная фильтрация',
  'Экспорт данных в различных форматах',
  'Логирование действий администратора',
  'Dashboard с аналитикой и статистикой'
];

const userFeatures = [
  'Просмотр отзывов в режиме "только чтение"',
  'Возможность оставлять собственные отзывы',
  'Редактирование своего профиля',
  'Просмотр собственной активности',
  'Уведомления о важных событиях'
];

export default function Lab8() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);

  const [currentTab, setCurrentTab] = useState(0);
  const [demoData] = useState(() => generateDemoData(50));
  const [searchValue, setSearchValue] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  // Колонки для демонстрационной таблицы
  const demoColumns = useMemo(() => [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({ getValue }) => (
        <Chip label={`#${getValue()}`} size="small" variant="outlined" />
      )
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Имя пользователя',
      cell: ({ getValue }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {getValue()}
          </Typography>
        </Box>
      )
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">
          {getValue()}
        </Typography>
      )
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: 'Роль',
      size: 120,
      cell: ({ getValue }) => (
        <Chip
          label={getValue() === 'admin' ? 'Админ' : 'Пользователь'}
          size="small"
          color={getValue() === 'admin' ? 'error' : 'primary'}
          icon={getValue() === 'admin' ? <AdminPanelSettings /> : <People />}
        />
      )
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Статус',
      size: 120,
      cell: ({ getValue }) => (
        <Chip
          label={getValue() === 'active' ? 'Активен' : 'Заблокирован'}
          size="small"
          color={getValue() === 'active' ? 'success' : 'error'}
          icon={getValue() === 'active' ? <CheckCircle /> : <Security />}
        />
      )
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Дата регистрации',
      cell: ({ getValue }) => (
        <Typography variant="body2">
          {new Date(getValue()).toLocaleDateString('ru-RU')}
        </Typography>
      )
    }
  ], []);

  // Фильтрация демо данных
  const filteredDemoData = useMemo(() => {
    if (!searchValue) return demoData;
    return demoData.filter(user =>
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [demoData, searchValue]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: isMobile ? 10 : 4 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Лабораторная работа №8
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          React Table, система ролей и панель администрирования
        </Typography>

        {/* Статус пользователя */}
        {isAuthenticated && (
          <Alert
            severity={isAdmin ? "success" : "info"}
            sx={{ mt: 2 }}
            icon={isAdmin ? <AdminPanelSettings /> : <People />}
          >
            <Typography variant="body2" fontWeight="medium">
              Ваша роль: {isAdmin ? '👑 Администратор' : '👤 Пользователь'}
              {isAdmin && ' - у вас есть полный доступ к системе администрирования'}
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Вкладки */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
        >
          <Tab label="Обзор возможностей" icon={<DataArray />} />
          <Tab label="Демонстрация таблицы" icon={<TableChart />} />
          <Tab label="Отзывы пользователей" icon={<Feedback />} />
          {isAdmin && <Tab label="Административный доступ" icon={<AdminPanelSettings />} />}
        </Tabs>
      </Paper>

      {/* Содержимое вкладок */}
      {currentTab === 0 && (
        <Box>
          {/* Основные возможности */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayArrow color="primary" />
            Реализованные возможности
          </Typography>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Box sx={{ color: `${feature.color}.main`, mb: 2, fontSize: '3rem' }}>
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
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List dense>
                      {feature.details.map((detail, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                {detail}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Технологический стек */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Code />
              Технологический стек
            </Typography>

            <Typography variant="body2" paragraph>
              <strong>@tanstack/react-table:</strong> Современная библиотека для создания мощных таблиц
              с поддержкой серверной пагинации, сортировки и фильтрации.
            </Typography>

            <Typography variant="body2" paragraph>
              <strong>@dnd-kit:</strong> Модульная библиотека drag & drop для React с поддержкой
              accessibility и мощными возможностями настройки.
            </Typography>

            <Typography variant="body2" paragraph>
              <strong>@tanstack/react-virtual:</strong> Виртуализация списков и таблиц для
              оптимизации производительности при работе с большими объемами данных.
            </Typography>

            <Typography variant="body2">
              <strong>Material-UI + Redux Toolkit:</strong> Полноценный UI Kit с управлением состоянием
              приложения и серверными запросами через RTK Query.
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[
                '@tanstack/react-table',
                '@dnd-kit/core',
                '@tanstack/react-virtual',
                'Redux Toolkit',
                'Material-UI',
                'React Router',
                'Role-based Access'
              ].map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: 'primary.contrastText',
                    borderColor: 'primary.contrastText'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {currentTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableChart color="primary" />
            Демонстрация возможностей таблицы
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" paragraph>
              <strong>Доступные функции:</strong>
            </Typography>
            <Typography variant="body2" component="div">
              • <strong>Поиск:</strong> Используйте поле поиска для фильтрации данных<br/>
              • <strong>Сортировка:</strong> Кликните на заголовки колонок для сортировки<br/>
              • <strong>Drag & Drop:</strong> Перетаскивайте иконки рядом с заголовками колонок<br/>
              • <strong>Настройка колонок:</strong> Используйте кнопку настройки для скрытия/показа колонок<br/>
              • <strong>Мобильная версия:</strong> На мобильных устройствах первая колонка зафиксирована
            </Typography>
          </Alert>

          <AdvancedDataTable
            title={`Демонстрационная таблица пользователей (${filteredDemoData.length})`}
            data={filteredDemoData}
            columns={demoColumns}
            loading={false}
            totalCount={filteredDemoData.length}
            page={0}
            pageSize={10}
            onSearchChange={setSearchValue}
            searchValue={searchValue}
            virtualScrolling={filteredDemoData.length > 20}
            fixedFirstColumn={isMobile}
          />
        </Box>
      )}

      {currentTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Feedback color="primary" />
            Система отзывов
          </Typography>

          {!isAdmin && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Пользовательский режим:</strong> Вы можете просматривать только активные отзывы.
                Для полного управления отзывами необходимы права администратора.
              </Typography>
            </Alert>
          )}

          <ReadOnlyFeedbackList />
        </Box>
      )}

      {currentTab === 3 && isAdmin && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AdminPanelSettings color="primary" />
            Административные функции
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People />
                    Управление пользователями
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Полноценная система управления пользователями с продвинутой таблицей
                  </Typography>
                  <List dense>
                    {adminFeatures.slice(0, 4).map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              {feature}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="contained"
                    startIcon={<People />}
                    onClick={() => navigate('/admin/users')}
                    fullWidth
                  >
                    Управление пользователями
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Feedback />
                    Модерация отзывов
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Система модерации и управления отзывами пользователей
                  </Typography>
                  <List dense>
                    {adminFeatures.slice(4, 8).map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              {feature}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Feedback />}
                    onClick={() => navigate('/admin/feedbacks')}
                    fullWidth
                  >
                    Модерация отзывов
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminPanelSettings />
                    Панель управления
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Центральная панель администрирования с аналитикой и быстрыми действиями
                  </Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<AdminPanelSettings />}
                    onClick={() => navigate('/admin')}
                    size="large"
                  >
                    Открыть панель администрирования
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Инструкции для тестирования */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          💡 Как протестировать функционал:
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Для администраторов:</strong> Войдите как admin/admin123 для полного доступа к системе администрирования<br/>
          <strong>Демо таблица:</strong> Протестируйте поиск, сортировку, drag&drop и настройку колонок<br/>
          <strong>Мобильная версия:</strong> Уменьшите окно браузера для тестирования адаптивности<br/>
          <strong>Виртуализация:</strong> Автоматически включается для таблиц с большим количеством строк
        </Typography>
      </Alert>
    </Container>
  );
}
