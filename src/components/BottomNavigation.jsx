import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Zoom,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import {
  Home,
  Person,
  Feedback,
  Add,
  Close
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FeedbackForm from './FeedbackForm';

export default function BottomNavigationBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  // Показываем только на мобильных устройствах
  if (!isMobile) {
    return null;
  }

  const handleNavigationChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/about');
        break;
      case 2:
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const getCurrentValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/about') return 1;
    if (location.pathname === '/profile') return 2;
    return -1;
  };

  const handleFeedbackOpen = () => {
    setFeedbackDialogOpen(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackDialogOpen(false);
  };

  return (
    <>
      {/* Основная нижняя навигация */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar
        }}
        elevation={3}
      >
        <BottomNavigation
          value={getCurrentValue()}
          onChange={handleNavigationChange}
          showLabels
        >
          <BottomNavigationAction
            label="Главная"
            icon={<Home />}
          />
          <BottomNavigationAction
            label="О себе"
            icon={<Person />}
          />
          <BottomNavigationAction
            label="Профиль"
            icon={<Person />}
          />
        </BottomNavigation>
      </Paper>

      {/* FAB для быстрых действий */}
      <Zoom in={true}>
        <Fab
          color="primary"
          aria-label="feedback"
          onClick={handleFeedbackOpen}
          sx={{
            position: 'fixed',
            bottom: 80, // Над нижней навигацией
            right: 16,
            zIndex: theme.zIndex.fab
          }}
        >
          <Feedback />
        </Fab>
      </Zoom>

      {/* Диалог для обратной связи */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={handleFeedbackClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Обратная связь
          <IconButton
            aria-label="close"
            onClick={handleFeedbackClose}
            sx={{ ml: 1 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FeedbackForm onSuccess={handleFeedbackClose} />
        </DialogContent>
      </Dialog>

      {/* Отступ для контента, чтобы не перекрывался нижней навигацией */}
      <div style={{ height: 56 }} />
    </>
  );
}
