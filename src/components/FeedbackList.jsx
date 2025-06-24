import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedbacks, deleteFeedback} from "../store/feedbackSlice";

export default function FeedbackList() {
  const dispatch = useDispatch();
  const { items: feedbacks, loading, error } = useSelector((state) => state.feedback);
  const { currentUser } = useSelector((state) => state.user);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const handleDeleteClick = (feedback) => {
    setFeedbackToDelete(feedback);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (feedbackToDelete) {
      try {
        await dispatch(deleteFeedback(feedbackToDelete.id)).unwrap();
        setDeleteDialogOpen(false);
        setFeedbackToDelete(null);
      } catch (error) {
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFeedbackToDelete(null);
  };

  const canDeleteFeedback = (feedback) => {
    // Пользователь может удалять свои отзывы
    return currentUser && feedback.userId === currentUser.id;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (loading && feedbacks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Отзывы ({feedbacks.length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {feedbacks.length === 0 && !loading ? (
        <Typography>Нет отзывов</Typography>
      ) : (
        feedbacks.map((feedback) => (
          <Card key={feedback.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {feedback.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {feedback.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {formatDate(feedback.createdAt)}
                  </Typography>
                </Box>

                {canDeleteFeedback(feedback) && (
                  <Box>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(feedback)}
                      size="small"
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить этот отзыв?
          </Typography>
          {feedbackToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {feedbackToDelete.name}
              </Typography>
              <Typography variant="body2">
                {feedbackToDelete.text}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={loading}>
            Отменить
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
