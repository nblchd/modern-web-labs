import {
  Container,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Delete,
  Block,
  CheckCircle,
  Visibility,
  Edit
} from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import AdvancedDataTable from '../components/AdvancedDataTable';

const API_URL = "http://localhost:3001/api";

export default function AdminFeedbacksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useSelector((state) => state.user);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchValue, setSearchValue] = useState('');
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);

  // Диалоги
  const [deleteDialog, setDeleteDialog] = useState({ open: false, feedback: null });
  const [blockDialog, setBlockDialog] = useState({ open: false, feedback: null });
  const [viewDialog, setViewDialog] = useState({ open: false, feedback: null });

  // Проверка прав доступа
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Доступ запрещен. Требуются права администратора.
        </Alert>
      </Container>
    );
  }

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/feedbacks/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: page + 1,
          limit: pageSize,
          sortBy,
          sortOrder,
          search: searchValue
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbacks(data.data);
        setTotalCount(data.total);
      } else {
        console.error('Failed to fetch feedbacks:', data.error);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page, pageSize, sortBy, sortOrder, searchValue]);

  const handleDeleteFeedback = async (feedback) => {
    try {
      const response = await fetch(`${API_URL}/feedbacks/${feedback.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id
        }),
      });

      if (response.ok) {
        fetchFeedbacks();
        setDeleteDialog({ open: false, feedback: null });
      } else {
        const data = await response.json();
        console.error('Failed to delete feedback:', data.error);
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handleBlockFeedback = async (feedback) => {
    try {
      const newStatus = feedback.status === 'active' ? 'blocked' : 'active';

      const response = await fetch(`${API_URL}/feedbacks/${feedback.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          status: newStatus
        }),
      });

      if (response.ok) {
        fetchFeedbacks();
        setBlockDialog({ open: false, feedback: null });
      } else {
        const data = await response.json();
        console.error('Failed to block feedback:', data.error);
      }
    } catch (error) {
      console.error('Error blocking feedback:', error);
    }
  };

  // Функция для обрезки текста
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Определение колонок таблицы
  const columns = useMemo(() => [
    {
      id: 'name',
      header: 'Автор',
      accessorKey: 'name',
      size: 150,
    },
    {
      id: 'text',
      header: 'Отзыв',
      accessorKey: 'text',
      size: 300,
      cell: ({ row }) => (
        <Tooltip title={row.original.text} arrow>
          <Box sx={{
            maxWidth: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}>
            {truncateText(row.original.text, 80)}
          </Box>
        </Tooltip>
      ),
    },
    {
      id: 'status',
      header: 'Статус',
      accessorKey: 'status',
      size: 120,
      cell: ({ row }) => (
        <Chip
          icon={row.original.status === 'active' ? <CheckCircle /> : <Block />}
          label={row.original.status === 'active' ? 'Активен' : 'Заблокирован'}
          color={row.original.status === 'active' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      id: 'createdAt',
      header: 'Дата создания',
      accessorKey: 'createdAt',
      size: 150,
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('ru-RU'),
    },
    {
      id: 'userId',
      header: 'ID пользователя',
      accessorKey: 'userId',
      size: 120,
      cell: ({ row }) => row.original.userId || 'Анонимный',
    },
  ], []);

  // Действия для строк таблицы
  const actions = useMemo(() => [
    {
      label: 'Просмотреть',
      icon: <Visibility />,
      onClick: (feedback) => setViewDialog({ open: true, feedback }),
    },
    {
      label: 'Редактировать',
      icon: <Edit />,
      onClick: (feedback) => {
        // TODO: Открыть форму редактирования
        console.log('Edit feedback:', feedback);
      },
    },
    {
      label: (feedback) => feedback.status === 'active' ? 'Заблокировать' : 'Разблокировать',
      icon: <Block />,
      onClick: (feedback) => setBlockDialog({ open: true, feedback }),
    },
    {
      label: 'Удалить',
      icon: <Delete />,
      onClick: (feedback) => setDeleteDialog({ open: true, feedback }),
    },
  ], []);

  const handleSortChange = (sortConfig) => {
    if (sortConfig) {
      setSortBy(sortConfig.id);
      setSortOrder(sortConfig.desc ? 'desc' : 'asc');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: isMobile ? 10 : 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление отзывами
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Просмотр, модерация и управление отзывами пользователей
      </Typography>

      <AdvancedDataTable
        title={`Отзывы (${totalCount})`}
        data={feedbacks}
        columns={columns}
        loading={loading}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={handleSortChange}
        onSearchChange={setSearchValue}
        searchValue={searchValue}
        actions={actions}
        selectable={true}
        onSelectionChange={setSelectedFeedbacks}
        virtualScrolling={totalCount > 100}
        fixedFirstColumn={isMobile}
      />

      {/* Диалог просмотра отзыва */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, feedback: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Отзыв от {viewDialog.feedback?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Дата создания: {viewDialog.feedback && new Date(viewDialog.feedback.createdAt).toLocaleString('ru-RU')}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Статус: {' '}
              <Chip
                size="small"
                label={viewDialog.feedback?.status === 'active' ? 'Активен' : 'Заблокирован'}
                color={viewDialog.feedback?.status === 'active' ? 'success' : 'error'}
              />
            </Typography>
            {viewDialog.feedback?.userId && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ID пользователя: {viewDialog.feedback.userId}
              </Typography>
            )}
          </Box>

          <Typography variant="h6" gutterBottom>
            Текст отзыва:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {viewDialog.feedback?.text}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, feedback: null })}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, feedback: null })}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить отзыв от{' '}
            <strong>{deleteDialog.feedback?.name}</strong>?
            Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, feedback: null })}>
            Отменить
          </Button>
          <Button
            onClick={() => handleDeleteFeedback(deleteDialog.feedback)}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения блокировки */}
      <Dialog
        open={blockDialog.open}
        onClose={() => setBlockDialog({ open: false, feedback: null })}
      >
        <DialogTitle>
          {blockDialog.feedback?.status === 'active' ? 'Блокировка' : 'Разблокировка'} отзыва
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите{' '}
            {blockDialog.feedback?.status === 'active' ? 'заблокировать' : 'разблокировать'}{' '}
            отзыв от <strong>{blockDialog.feedback?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialog({ open: false, feedback: null })}>
            Отменить
          </Button>
          <Button
            onClick={() => handleBlockFeedback(blockDialog.feedback)}
            color={blockDialog.feedback?.status === 'active' ? 'warning' : 'success'}
            variant="contained"
          >
            {blockDialog.feedback?.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
