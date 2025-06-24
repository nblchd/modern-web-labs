import { Paper, Box } from '@mui/material';

export default function Content({ children }) {
  return (
    <Paper sx={{ p: 3, ml: 2, flex: 1 }}>
      {children}
    </Paper>
  );
}
