import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  useScrollTrigger,
  Slide
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  AccountCircle,
  Home,
  Person
} from '@mui/icons-material';
import { useState, useContext, forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorModeContext } from '../ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Кастомный хук для получения состояния скролла
export function useHeaderVisible() {
  const trigger = useScrollTrigger({
    threshold: 100,
  });
  return !trigger;
}

const Header = forwardRef(function Header({ onMenuToggle }, ref) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const dispatch = useDispatch();

  const { currentUser, isAuthenticated } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth");
    handleProfileMenuClose();
    navigate('/');
  };

  const handleProfileEdit = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);

  const menuItems = [
    { label: 'Главная', path: '/', icon: <Home /> },
    { label: 'О себе', path: '/about', icon: <Person /> },
  ];

  return (
    <AppBar ref={ref} position="fixed" elevation={1}>
      <Toolbar>
        {/* Кнопка меню (только на мобильных) */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Логотип/Заголовок */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: { xs: 1, md: 0 },
            mr: { md: 4 },
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          ССРВП Labs
        </Typography>

        {/* Навигационное меню (только на десктопе) */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  mr: 1,
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ flexGrow: { xs: 0, md: 1 } }} />

        {/* Переключатель темы */}
        <IconButton
          color="inherit"
          onClick={toggleColorMode}
          sx={{ mr: 1 }}
          title={`Переключить на ${mode === 'light' ? 'темную' : 'светлую'} тему`}
        >
          {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>

        {/* Профиль пользователя */}
        {isAuthenticated ? (
          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {currentUser?.avatar ? (
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {currentUser?.name?.charAt(0)?.toUpperCase() || currentUser?.login?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              id="primary-search-account-menu"
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={isMenuOpen}
              onClose={handleProfileMenuClose}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle2">
                    {currentUser?.name || currentUser?.login}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {currentUser?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleProfileEdit}>
                <AccountCircle sx={{ mr: 2 }} />
                Профиль
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Выйти
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            color="inherit"
            onClick={() => navigate('/login')}
            startIcon={<AccountCircle />}
          >
            Войти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
});

export default function ScrollHeader({ onMenuToggle }) {
  return (
    <HideOnScroll>
      <Header onMenuToggle={onMenuToggle} />
    </HideOnScroll>
  );
}
