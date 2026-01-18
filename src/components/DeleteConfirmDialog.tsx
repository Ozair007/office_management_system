import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { deleteUser } from '../api/users';
import type { ManagedUser } from '../types';

interface DeleteConfirmDialogProps {
  open: boolean;
  user: ManagedUser | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export default function DeleteConfirmDialog({ open, user, onClose, onConfirm }: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      await deleteUser(user.id);
      onConfirm(user.id);
    } catch {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Typography>
          Are you sure you want to delete{' '}
          <strong>
            {user?.firstName} {user?.lastName}
          </strong>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
