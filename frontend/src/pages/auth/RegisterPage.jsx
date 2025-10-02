import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext.jsx';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      console.error('Registration error:', err.response?.data);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" mb={2}>Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" helperText="Minimum 8 characters" />
            <Button type="submit" variant="contained" disabled={loading}>Create account</Button>
          </Stack>
        </form>
        <Typography mt={2} variant="body2">Have an account? <Link to="/login">Login</Link></Typography>
      </Paper>
    </Box>
  );
}


