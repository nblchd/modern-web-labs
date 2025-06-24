import {
  Container,
  Typography,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  Edit,
  Delete,
  Block,
  CheckCircle,
  Person
} from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import AdvancedDataTable from '../components/AdvancedDataTable';

const API_URL = "http://localhost:3001/api";

export default function AdminUsersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchValue, setSearchValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Диалоги
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [blockDialog, setBlockDialog] = useState({ open: false, user: null });

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          page: page + 1,
          limit: pageSize,
          sortBy,
          sortOrder,
          search: searchValue
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.data);
        setTotalCount(data.total);
      } else {
        console.error('Failed to fetch users:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, sortBy, sortOrder, searchValue]);

  const handleDeleteUser = async (user) => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id
        }),
      });

      if (response.ok) {
        fetchUsers();
        setDeleteDialog({ open: false, user: null });
      } else {
        const data = await response.json();
        console.error('Failed to delete user:', data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBlockUser = async (user) => {
    try {
      const newStatus = user.status === 'active' ? 'blocked' : 'active';

      const response = await fetch(`${API_URL}/users/${user.id}`, {
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
        fetchUsers();
        setBlockDialog({ open: false, user: null });
      } else {
        const data = await response.json();
        console.error('Failed to block user:', data.error);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  // Определение колонок таблицы
  const columns = useMemo(() => [
    {
      id: 'avatar',
      header: '',
      accessorKey: 'name',
      size: 60,
      cell: ({ row }) => (
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {row.original.name?.charAt(0)?.toUpperCase() ||
           row.original.login?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
      ),
      enableSorting: false,
    },
    {
      id: 'login',
      header: 'Логин',
      accessorKey: 'login',
      size: 120,
    },
    {
      id: 'name',
      header: 'Имя',
      accessorKey: 'name',
      size: 150,
      cell: ({ row }) => row.original.name || 'Не указано',
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      size: 200,
      cell: ({ row }) => row.original.email || 'Не указан',
    },
    {
      id: 'role',
      header: 'Роль',
      accessorKey: 'role',
      size: 100,
      cell: ({ row }) => (
        <Chip
          icon={row.original.role === 'admin' ? <Admin /> : <Person />}
          label={row.original.role === 'admin' ? 'Админ' : 'Пользователь'}
          color={row.original.role === 'admin' ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'status',
      header: 'Статус',
      accessorKey: 'status',
      size: 100,
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
      header: 'Дата регистрации',
      accessorKey: 'createdAt',
      size: 150,
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('ru-RU'),
    },
  ], []);

  // Действия для строк таблицы
  const actions = useMemo(() => [
    {
      label: 'Редактировать',
      icon: <Edit />,
      onClick: (user) => {
        // TODO: Открыть форму редактирования
        console.log('Edit user:', user);
      },
    },
    {
      label: (user) => user.status === 'active' ? 'Заблокировать' : 'Разблокировать',
      icon: <Block />,
      onClick: (user) => setBlockDialog({ open: true, user }),
      disabled: (user) => user.id === currentUser.id, // Нельзя заблокировать себя
    },
    {
      label: 'Удалить',
      icon: <Delete />,
      onClick: (user) => setDeleteDialog({ open: true, user }),
      disabled: (user) => user.id === currentUser.id, // Нельзя удалить себя
    },
  ], [currentUser.id]);

  const handleSortChange = (sortConfig) => {
    if (sortConfig) {
      setSortBy(sortConfig.id);
      setSortOrder(sortConfig.desc ? 'desc' : 'asc');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: isMobile ? 10 : 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление пользователями
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Просмотр, редактирование и управление пользователями системы
      </Typography>

      <AdvancedDataTable
        title={`Пользователи (${totalCount})`}
        data={users}
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
        onSelectionChange={setSelectedUsers}
        virtualScrolling={totalCount > 100}
        fixedFirstColumn={isMobile}
      />

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить пользователя{' '}
            <strong>{deleteDialog.user?.name || deleteDialog.user?.login}</strong>?
            Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
            Отменить
          </Button>
          <Button
            onClick={() => handleDeleteUser(deleteDialog.user)}
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
        onClose={() => setBlockDialog({ open: false, user: null })}
      >
        <DialogTitle>
          {blockDialog.user?.status === 'active' ? 'Блокировка' : 'Разблокировка'} пользователя
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите{' '}
            {blockDialog.user?.status === 'active' ? 'заблокировать' : 'разблокировать'}{' '}
            пользователя <strong>{blockDialog.user?.name || blockDialog.user?.login}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialog({ open: false, user: null })}>
            Отменить
          </Button>
          <Button
            onClick={() => handleBlockUser(blockDialog.user)}
            color={blockDialog.user?.status === 'active' ? 'warning' : 'success'}
            variant="contained"
          >
            {blockDialog.user?.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
