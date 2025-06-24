const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

const initDB = async () => {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialData = {
      users: [],
      feedbacks: []
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
};

const readDB = async () => {
  const data = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
};

const writeDB = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

const generateId = () => Date.now().toString();

// GET /api/users - получить всех пользователей
app.get('/api/users', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.users);
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
    res.json(user);
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
      password,
      email: email || '',
      name: name || '',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    await writeDB(db);

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

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id - обновить пользователя
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const db = await readDB();

    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name !== undefined) db.users[userIndex].name = name;
    if (email !== undefined) db.users[userIndex].email = email;
    db.users[userIndex].updatedAt = new Date().toISOString();

    await writeDB(db);

    const { password: _, ...userWithoutPassword } = db.users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /api/feedbacks - получить все отзывы
app.get('/api/feedbacks', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/feedbacks/:id - получить отзыв по ID
app.get('/api/feedbacks/:id', async (req, res) => {
  try {
    const db = await readDB();
    const feedback = db.feedbacks.find(f => f.id === req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
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
    const { name, text } = req.body;
    const db = await readDB();

    const feedbackIndex = db.feedbacks.findIndex(f => f.id === req.params.id);
    if (feedbackIndex === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    if (name !== undefined) db.feedbacks[feedbackIndex].name = name;
    if (text !== undefined) db.feedbacks[feedbackIndex].text = text;
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
    const db = await readDB();
    const feedbackIndex = db.feedbacks.findIndex(f => f.id === req.params.id);

    if (feedbackIndex === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
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
  });
};

startServer().catch(console.error);
