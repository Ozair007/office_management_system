import { Box, Card, CardContent, Typography, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Welcome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Avatar
            src={user.image}
            alt={user.firstName}
            sx={{ width: 100, height: 100, mx: 'auto', mb: 3 }}
          />
          <Typography variant="h3" component="h1" gutterBottom>
            Hello {user.firstName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Welcome to the Office Management System
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
