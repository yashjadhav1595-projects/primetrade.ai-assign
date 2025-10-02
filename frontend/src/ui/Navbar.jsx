import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }} component={Link} to="/" color="inherit" style={{ textDecoration: 'none' }}>
          PrimeTrade
        </Typography>
        <Stack direction="row" spacing={1}>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
              <Button color="inherit" onClick={async () => { await logout(); navigate('/login'); }}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}


