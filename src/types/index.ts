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
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (token: string, user: User) => void;
	logout: () => void;
}