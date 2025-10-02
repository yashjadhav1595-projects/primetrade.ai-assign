import { Typography } from '@mui/material';
import { useAuth } from '../../state/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography>Welcome{user ? `, ${user.name}` : ''}.</Typography>
    </>
  );
}


