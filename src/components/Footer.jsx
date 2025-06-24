import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ textAlign: 'center', p: 2, mt: 4, background: '#eee' }}>
      <Typography variant="body2">&copy; ССРВП 2025 Лабораторные работы</Typography>
    </Box>
  );
}
