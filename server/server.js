const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Путь к файлу базы данных
const DB_PATH = path.join(__dirname, 'db.json');

// Инициализация базы данных
const initDB = async () => {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialData = {
      users: [
        // Создаем admin пользователя по умолчанию
        {
          id: 'admin-1',
          login: 'admin',
          password: 'admin123',
          name: 'Администратор',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ],
      feedbacks: []
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
};

// Чтение данных из базы
const readDB = async () => {
  const data = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
};

// Запись данных в базу
const writeDB = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

// Генерация ID
const generateId = () => Date.now().toString();

// Middleware для проверки роли admin
const requireAdmin = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  const db = await readDB();
  const user = db.users.find(u => u.id === userId);

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.currentUser = user;
  next();
};

// USERS ROUTES

// GET /api/users - получить всех пользователей (только для admin)
app.post('/api/users/list', async (req, res) => {
  try {
    const { userId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search = '' } = req.body;

    const db = await readDB();
    const requestingUser = db.users.find(u => u.id === userId);

    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    let users = db.users.map(({ password, ...user }) => user); // Убираем пароли

    // Поиск
    if (search) {
      users = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.login?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Сортировка
    users.sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Пагинация
    const start = (page - 1) * limit;
    const paginatedUsers = users.slice(start, start + limit);

    res.json({
      data: paginatedUsers,
      total: users.length,
      page: Number(page),
      totalPages: Math.ceil(users.length / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/:id - получить пользователя по ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const db = await readDB();
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/register - регистрация пользователя
app.post('/api/users/register', async (req, res) => {
  try {
    const { login, password, email, name } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Login and password are required' });
    }

    const db = await readDB();

    // Проверка на существующего пользователя
    const existingUser = db.users.find(u => u.login === login);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = {
      id: generateId(),
      login,
      password, // В реальном приложении пароль должен быть захеширован
      email: email || '',
      name: name || '',
      role: 'user', // По умолчанию роль user
      status: 'active',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    await writeDB(db);

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/login - авторизация пользователя
app.post('/api/users/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Login and password are required' });
    }

    const db = await readDB();
    const user = db.users.find(u => u.login === login && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'User is blocked' });
    }

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id - обновить пользователя
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role, status, userId } = req.body;
    const db = await readDB();

    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Проверка прав доступа
    if (userId) {
      const requestingUser = db.users.find(u => u.id === userId);
      if (!requestingUser) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Админ может изменять всё, обычный пользователь - только свои данные
      if (requestingUser.role !== 'admin' && requestingUser.id !== req.params.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Обычный пользователь не может изменять роль и статус
      if (requestingUser.role !== 'admin') {
        delete req.body.role;
        delete req.body.status;
      }
    }

    // Обновляем разрешенные поля
    if (name !== undefined) db.users[userIndex].name = name;
    if (email !== undefined) db.users[userIndex].email = email;
    if (role !== undefined) db.users[userIndex].role = role;
    if (status !== undefined) db.users[userIndex].status = status;
    db.users[userIndex].updatedAt = new Date().toISOString();

    await writeDB(db);

    const { password: _, ...userWithoutPassword } = db.users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/:id - удалить пользователя (только admin)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const db = await readDB();

    const requestingUser = db.users.find(u => u.id === userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Нельзя удалить самого себя
    if (req.params.id === userId) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const deletedUser = db.users.splice(userIndex, 1)[0];
    await writeDB(db);

    const { password: _, ...userWithoutPassword } = deletedUser;
    res.json({ message: 'User deleted successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// FEEDBACKS ROUTES

// POST /api/feedbacks/list - получить все отзывы с пагинацией
app.post('/api/feedbacks/list', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search = '' } = req.body;
    const db = await readDB();

    let feedbacks = db.feedbacks;

    // Поиск
    if (search) {
      feedbacks = feedbacks.filter(feedback =>
        feedback.name?.toLowerCase().includes(search.toLowerCase()) ||
        feedback.text?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Сортировка
    feedbacks.sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Пагинация
    const start = (page - 1) * limit;
    const paginatedFeedbacks = feedbacks.slice(start, start + limit);

    res.json({
      data: paginatedFeedbacks,
      total: feedbacks.length,
      page: Number(page),
      totalPages: Math.ceil(feedbacks.length / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/feedbacks - получить все отзывы (для обычных пользователей)
app.get('/api/feedbacks', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/feedbacks - создать новый отзыв
app.post('/api/feedbacks', async (req, res) => {
  try {
    const { name, text, userId } = req.body;

    if (!name || !text) {
      return res.status(400).json({ error: 'Name and text are required' });
    }

    const newFeedback = {
      id: generateId(),
      name,
      text,
      userId: userId || null,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const db = await readDB();
    db.feedbacks.push(newFeedback);
    await writeDB(db);

    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/feedbacks/:id - обновить отзыв
app.put('/api/feedbacks/:id', async (req, res) => {
  try {
    const { name, text, status, userId } = req.body;
    const db = await readDB();

    const feedbackIndex = db.feedbacks.findIndex(f => f.id === req.params.id);
    if (feedbackIndex === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Проверка прав доступа
    if (userId) {
      const requestingUser = db.users.find(u => u.id === userId);
      if (!requestingUser) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Обычный пользователь может изменять только свои отзывы
      if (requestingUser.role !== 'admin' && db.feedbacks[feedbackIndex].userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Обычный пользователь не может изменять статус
      if (requestingUser.role !== 'admin') {
        delete req.body.status;
      }
    }

    if (name !== undefined) db.feedbacks[feedbackIndex].name = name;
    if (text !== undefined) db.feedbacks[feedbackIndex].text = text;
    if (status !== undefined) db.feedbacks[feedbackIndex].status = status;
    db.feedbacks[feedbackIndex].updatedAt = new Date().toISOString();

    await writeDB(db);
    res.json(db.feedbacks[feedbackIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/feedbacks/:id - удалить отзыв
app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const db = await readDB();

    const feedbackIndex = db.feedbacks.findIndex(f => f.id === req.params.id);
    if (feedbackIndex === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Проверка прав доступа
    if (userId) {
      const requestingUser = db.users.find(u => u.id === userId);
      if (!requestingUser) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Обычный пользователь может удалять только свои отзывы
      if (requestingUser.role !== 'admin' && db.feedbacks[feedbackIndex].userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const deletedFeedback = db.feedbacks.splice(feedbackIndex, 1)[0];
    await writeDB(db);

    res.json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Запуск сервера
const startServer = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Default admin credentials: admin / admin123`);
  });
};

startServer().catch(console.error);
