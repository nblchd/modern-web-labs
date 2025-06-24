import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  useScrollTrigger
} from '@mui/material';
import {
  Science,
  Assignment,
  Code,
  Api,
  Storage,
  Palette,
  Web,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const labs = [
  {
    id: 1,
    title: 'Основы React',
    icon: <Code />,
    description: 'Компоненты, состояние, события',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Пользовательские компоненты',
    icon: <Assignment />,
    description: 'Создание переиспользуемых компонентов',
    color: 'secondary'
  },
  {
    id: 3,
    title: 'Маршрутизация',
    icon: <Web />,
    description: 'React Router, навигация',
    color: 'success'
  },
  {
    id: 4,
    title: 'Жизненный цикл',
    icon: <Science />,
    description: 'useEffect, Redux',
    color: 'warning'
  },
  {
    id: 5,
    title: 'Формы и валидация',
    icon: <Assignment />,
    description: 'React Hook Form, обратная связь',
    color: 'info'
  },
  {
    id: 6,
    title: 'REST API',
    icon: <Api />,
    description: 'HTTP запросы, промисы',
    color: 'error'
  },
  {
    id: 7,
    title: 'UI Kit & Адаптивность',
    icon: <Palette />,
    description: 'Material-UI, responsive design',
    color: 'primary'
  },
  {
    id: 8,
    title: 'Администрирование',
    icon: <Storage />,
    description: 'React Table, роли, админ панель',
    color: 'secondary'
  },
];

export default function ResponsiveDrawer({ open, onClose, variant = 'temporary' }) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Отслеживаем скролл для адаптации позиции drawer
  const trigger = useScrollTrigger({
    threshold: 100,
  });
  const headerVisible = !trigger;

  const handleItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      {/* Заголовок меню с кнопкой закрытия */}
      <Box sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
        {/* Кнопка закрытия (только для временного drawer) */}
        {variant === 'temporary' && (
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary'
            }}
          >
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        )}

        <Typography variant="h6" color="primary" gutterBottom>
          Лабораторные работы
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Курс "Современные средства разработки ВП"
        </Typography>
      </Box>

      <Divider />

      {/* Список лабораторных */}
      <List sx={{ px: 1 }}>
        {labs.map((lab) => {
          const isActive = location.pathname === `/lab/${lab.id}`;

          return (
            <ListItem key={lab.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={`/lab/${lab.id}`}
                onClick={handleItemClick}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: `${theme.palette[lab.color].main}15`,
                    '&:hover': {
                      backgroundColor: `${theme.palette[lab.color].main}25`,
                    },
                  },
                  '&:hover': {
                    backgroundColor: `${theme.palette[lab.color].main}08`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? `${lab.color}.main` : 'text.secondary',
                    minWidth: 40
                  }}
                >
                  {lab.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
                        Лаб. {lab.id}
                      </Typography>
                      <Chip
                        label={lab.id}
                        size="small"
                        color={lab.color}
                        variant={isActive ? 'filled' : 'outlined'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="textPrimary" fontWeight={500}>
                        {lab.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        {lab.description}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (variant === 'permanent') {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: headerVisible ? '64px' : '0px', // Адаптивная позиция
            height: headerVisible ? 'calc(100vh - 64px)' : '100vh', // Адаптивная высота
            position: 'fixed',
            transition: theme.transitions.create(['top', 'height'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
