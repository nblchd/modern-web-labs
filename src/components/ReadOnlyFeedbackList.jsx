import {
  Card,
  CardContent,
  Typography,
  Box,
  Pagination,
  Grid,
  Avatar,
  Chip,
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const API_URL = "http://localhost:3001/api";

export default function ReadOnlyFeedbackList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useSelector((state) => state.user);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchFeedbacks();
  }, [page]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/feedbacks/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: page,
          limit: itemsPerPage,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Показываем только активные отзывы для обычных пользователей
        const activeFeedbacks = data.data.filter(f => f.status === 'active');
        setFeedbacks(activeFeedbacks);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isOwnFeedback = (feedback) => {
    return currentUser && feedback.userId === currentUser.id;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Загрузка отзывов...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        💬 Отзывы пользователей ({feedbacks.length})
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Мнения участников курса о лабораторных работах
      </Typography>

      {feedbacks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Пока нет отзывов. Будьте первым!
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {feedbacks.map((feedback) => (
              <Grid item xs={12} md={6} key={feedback.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4]
                    },
                    position: 'relative'
                  }}
                >
                  {isOwnFeedback(feedback) && (
                    <Chip
                      label="Ваш отзыв"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1
                      }}
                    />
                  )}

                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: isOwnFeedback(feedback) ? 'primary.main' : 'secondary.main',
                          mr: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        {getInitials(feedback.name)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {feedback.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(feedback.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.6,
                        minHeight: 80,
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {feedback.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Пагинация */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
