import { List, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const labs = [
  { id: 1, title: 'Лабораторная 1' },
  { id: 2, title: 'Лабораторная 2' },
  { id: 3, title: 'Лабораторная 3' },
  { id: 4, title: 'Лабораторная 4' },
  { id: 5, title: 'Лабораторная 5' },
  { id: 6, title: 'Лабораторная 6' },
];

export default function Menu() {
  return (
    <List component="nav">
      {labs.map(lab => (
        <ListItemButton component={Link} to={`/lab/${lab.id}`} key={lab.id}>
          <ListItemText primary={lab.title} />
        </ListItemButton>
      ))}
    </List>
  );
}
