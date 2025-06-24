import Nav from "../components/Nav.jsx";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import {useState} from "react";
import {Typography} from "@mui/material";

export default function Lab1() {
 const [count, setCount] = useState(0);
  return(
      <div style={{width: '100%'}}>
      <Typography variant="h4" gutterBottom>
        Лабораторная работа №2
      </Typography>
        <Nav/>
        <Container>
            <h1>Hello World</h1>
            <p>Счетчик: {count}</p>
            <Button onClick={() => setCount(count + 1)}>Увеличить</Button>
            <Button onClick={() => setCount(count - 1)}>Уменьшить</Button>
        </Container>
    </div>)
      ;
}
