import { useState } from 'react';
import {Typography} from "@mui/material";

export default function Lab1() {
  const [count, setCount] = useState(0);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login === 'admin' && password === 'admin') {
      setAuthMessage('Успешная аутентификация!');
    } else {
      setAuthMessage('Неверный логин или пароль.');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Лабораторная работа №1
      </Typography>
      <p>Счетчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>Увеличить</button>
      <button onClick={() => setCount(count - 1)}>Уменьшить</button>

      <hr />

      <form onSubmit={handleSubmit}>
        <label>
          Логин:
          <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
        </label>
        <br />
        <label>
          Пароль:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Войти</button>
        <button type="button" onClick={() => {
          setLogin('');
          setPassword('');
          setAuthMessage('');
        }}>
          Очистить
        </button>
      </form>

      <p>{authMessage}</p>
    </div>
  );
}
