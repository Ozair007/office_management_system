import apiClient from './apiClient';
import type { ManagedUser, UsersResponse, UserFormData } from '../types';
import { USERS_PER_PAGE } from '../constants';

export async function fetchUsers(
	page: number,
	excludeIds: Set<number> = new Set()
): Promise<UsersResponse> {
	const skip = (page - 1) * USERS_PER_PAGE;
	const extraFetch = excludeIds.size;
	const response = await apiClient.get<UsersResponse>(
		`/users?limit=${USERS_PER_PAGE + extraFetch}&skip=${skip}&select=id,firstName,lastName,email,phone,age,image,company`
	);

	const filteredUsers = response.data.users
		.filter((u) => !excludeIds.has(u.id))
		.slice(0, USERS_PER_PAGE);

	return {
		users: filteredUsers,
		total: response.data.total - excludeIds.size,
		skip: response.data.skip,
		limit: USERS_PER_PAGE,
	};
}

export async function fetchUserById(id: number): Promise<ManagedUser> {
	const response = await apiClient.get<ManagedUser>(`/users/${id}`);
	return response.data;
}

export async function createUser(data: UserFormData): Promise<ManagedUser> {
	const payload = {
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phone: data.phone,
		age: data.age,
		company: {
			name: data.companyName,
			department: data.department,
			title: data.title,
		},
	};
	const response = await apiClient.post<ManagedUser>('/users/add', payload);
	return response.data;
}

export async function updateUser(id: number, data: UserFormData): Promise<ManagedUser> {
	const payload = {
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phone: data.phone,
		age: data.age,
		company: {
			name: data.companyName,
			department: data.department,
			title: data.title,
		},
	};
	const response = await apiClient.put<ManagedUser>(`/users/${id}`, payload);
	return response.data;
}

export async function deleteUser(id: number): Promise<ManagedUser> {
	const response = await apiClient.delete<ManagedUser>(`/users/${id}`);
	return response.data;
}
