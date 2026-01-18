import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { createUser, updateUser } from '../api/users';
import type { ManagedUser, UserFormData } from '../types';

let idCounter = 0;
function generateId(): number {
  idCounter += 1;
  return idCounter;
}

interface UserFormDialogProps {
  open: boolean;
  user: ManagedUser | null;
  onClose: () => void;
  onSave: (user: ManagedUser) => void;
}

export default function UserFormDialog({ open, user, onClose, onSave }: UserFormDialogProps) {
  const [error, setError] = useState('');
  // !!user coerces user to a boolean: true if user is not null/undefined, false otherwise.
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>();

  useEffect(() => {
    if (open) {
      reset(
        user
          ? {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              age: user.age,
              companyName: user.company?.name || '',
              department: user.company?.department || '',
              title: user.company?.title || '',
            }
          : {
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              age: 25,
              companyName: '',
              department: '',
              title: '',
            }
      );
    }
  }, [open, user, reset]);

  const onSubmit = async (data: UserFormData) => {
    setError('');
    try {
      let savedUser: ManagedUser;
      if (isEditing && user) {
        savedUser = await updateUser(user.id, data);
        savedUser = {
          ...user,
          ...savedUser,
          company: {
            name: data.companyName,
            department: data.department,
            title: data.title,
          },
        };
      } else {
        savedUser = await createUser(data);
        savedUser = {
          ...savedUser,
          id: savedUser.id || generateId(),
          image: '',
          company: {
            name: data.companyName,
            department: data.department,
            title: data.title,
          },
        };
      }
      onSave(savedUser);
    } catch {
      setError('Failed to save user');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Box sx={{ color: 'error.main', mb: 2 }}>
              {error}
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              {...register('firstName', { required: 'Required' })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              {...register('lastName', { required: 'Required' })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              margin="normal"
            />
          </Box>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email', {
              required: 'Required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Phone"
              {...register('phone', { required: 'Required' })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Age"
              type="number"
              {...register('age', {
                required: 'Required',
                min: { value: 18, message: 'Min 18' },
                max: { value: 120, message: 'Max 120' },
                valueAsNumber: true,
              })}
              error={!!errors.age}
              helperText={errors.age?.message}
              margin="normal"
            />
          </Box>
          <TextField
            fullWidth
            label="Company"
            {...register('companyName', { required: 'Required' })}
            error={!!errors.companyName}
            helperText={errors.companyName?.message}
            margin="normal"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Department"
              {...register('department', { required: 'Required' })}
              error={!!errors.department}
              helperText={errors.department?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Job Title"
              {...register('title', { required: 'Required' })}
              error={!!errors.title}
              helperText={errors.title?.message}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
