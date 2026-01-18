export interface LoginFormData {
	username: string;
	password: string;
}

export interface SignUpFormData {
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
}

export type LoginRequest = Omit<LoginFormData, never>;

export type SignUpRequest = Omit<SignUpFormData, 'confirmPassword'>;

export interface AuthResponse {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	image: string;
	accessToken: string;
	refreshToken: string;
}

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	image: string;
	phone?: string;
	age?: number;
	birthDate?: string;
	gender?: string;
	company?: {
		name: string;
		department: string;
		title: string;
	};
}

export interface ManagedUser {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	age: number;
	image: string;
	company: {
		name: string;
		department: string;
		title: string;
	};
}

export interface UserFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	age: number;
	companyName: string;
	department: string;
	title: string;
}

export interface UsersResponse {
	users: ManagedUser[];
	total: number;
	skip: number;
	limit: number;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (token: string, user: User) => void;
	logout: () => void;
}

export interface UserCardProps {
	user: ManagedUser;
	handleEditUser: (user: ManagedUser) => void;
	handleDeleteClick: (user: ManagedUser) => void;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
	mode: ThemeMode;
	toggleTheme: () => void;
}