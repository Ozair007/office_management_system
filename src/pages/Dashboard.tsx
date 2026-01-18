import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { fetchUsers } from '../api/users';
import type { ManagedUser } from '../types';
import { USERS_PER_PAGE } from '../constants';
import UserFormDialog from '../components/UserFormDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import UserCard from '../components/UserCard';

export default function Dashboard() {
  const { user: currentUser, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchUsers(page, deletedIds);
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, deletedIds]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (user: ManagedUser) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDeleteClick = (user: ManagedUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleUserSaved = (savedUser: ManagedUser) => {
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
    } else {
      setUsers((prev) => [savedUser, ...prev.slice(0, USERS_PER_PAGE - 1)]);
      setTotalUsers((prev) => prev + 1);
    }
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleUserDeleted = (deletedId: number) => {
    setDeletedIds((prev) => new Set(prev).add(deletedId));
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Typography sx={{ mr: 2 }}>Hello {currentUser?.firstName}</Typography>
          <Button color="inherit" onClick={logout}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Users</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser}>
            Add User
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 3,
              }}
            >
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  handleEditUser={handleEditUser}
                  handleDeleteClick={handleDeleteClick}
                />
              ))}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
              </Box>
            )}
          </>
        )}
      </Container>

      <UserFormDialog
        open={formOpen}
        user={editingUser}
        onClose={() => setFormOpen(false)}
        onSave={handleUserSaved}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        user={userToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleUserDeleted}
      />
    </Box>
  );
}
