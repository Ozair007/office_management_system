import { useContext } from 'react';
import { AuthContext } from '../context/authContextDef';
import type { AuthContextType } from '../types';

export function useAuth() {
	const context = useContext<AuthContextType | undefined>(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
