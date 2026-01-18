import { Avatar, Box, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import type { UserCardProps } from '../types'
import { useAuth } from '../hooks/useAuth';


export default function UserCard({ user, handleEditUser, handleDeleteClick }: UserCardProps) {
	const { user: currentUser } = useAuth();
	const isCurrentUser = user.id === currentUser?.id;

	return (
		<Card key={user.id}>
			<CardContent>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<Avatar src={user.image} alt={user.firstName} sx={{ width: 56, height: 56, mr: 2 }} />
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant="h6">
							{user.firstName} {user.lastName}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{user.company?.title || 'No title'}
						</Typography>
					</Box>
				</Box>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
					{user.email}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
					{user.phone}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{user.company?.department} @ {user.company?.name}
				</Typography>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
					<IconButton color="primary" onClick={() => handleEditUser(user)}>
						<Tooltip title="Edit user">
							<EditIcon />
						</Tooltip>
					</IconButton>
					<IconButton
						color={isCurrentUser ? 'default' : 'error'}
						onClick={() => isCurrentUser ? null : handleDeleteClick(user)}
					>
						<Tooltip title={user.id === currentUser?.id ? 'Cannot delete yourself' : 'Delete user'}>
							<DeleteIcon />
						</Tooltip>
					</IconButton>
				</Box>
			</CardContent>
		</Card>
	)
}