import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "../store/counterReducer";
import {Button, Typography} from "@mui/material";

export default function Lab4() {
  const [mounted, setMounted] = useState(true);
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter);

  useEffect(() => {
    console.log("🟢 Компонент смонтирован");
    return () => {
      console.log("🔴 Компонент размонтирован");
    };
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Лабораторная работа №4
      </Typography>

      <Button variant="contained" color="secondary" onClick={() => setMounted(!mounted)}>
        {mounted ? "Скрыть" : "Показать"} компонент
      </Button>

      {mounted && <p>Я смонтирован</p>}

      <hr />

      <h3>Redux Counter: {count}</h3>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}
