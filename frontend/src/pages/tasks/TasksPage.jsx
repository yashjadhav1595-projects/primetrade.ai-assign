import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../../services/api.js';

function TaskForm({ open, initial, onClose, onSaved }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  useEffect(() => { setTitle(initial?.title || ''); setDescription(initial?.description || ''); }, [initial]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title: title.trim(), description: description.trim() };
    if (initial?._id) await api.patch(`/tasks/${initial._id}`, payload);
    else await api.post('/tasks', payload);
    onSaved();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initial?._id ? 'Edit Task' : 'New Task'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline minRows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())), [tasks, query]);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks || []);
    } catch (e) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    await load();
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" onClick={() => { setEditing(null); setOpenForm(true); }}>New Task</Button>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField placeholder="Search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {view.map((t) => (
              <TableRow key={t._id} hover>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditing(t); setOpenForm(true); }} aria-label="edit"><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(t._id)} color="error" aria-label="delete"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && view.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}><Box p={2}>No tasks</Box></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack alignItems="center" mt={2}><Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} /></Stack>

      <TaskForm open={openForm} initial={editing} onClose={() => setOpenForm(false)} onSaved={() => { setOpenForm(false); load(); }} />
    </>
  );
}


