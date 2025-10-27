import { apiRequest } from '../lib/api-client';
import { Category, Feature } from '../types/api';

export const catalogService = {
  // Categories
  getCategories: (flat?: boolean) =>
    apiRequest.get<{ items: Category[] }>('/categories', { flat }),

  // Elevator Types
  getElevatorTypes: () =>
    apiRequest.get<{ items: any[] }>('/elevator-types'),

  createCategory: (data: {
    parentId?: number;
    title: string;
    slug?: string;
  }) =>
    apiRequest.post('/categories', data),

  updateCategory: (id: number, data: {
    title?: string;
    slug?: string;
    isActive?: boolean;
  }) =>
    apiRequest.put(`/categories/${id}`, data),

  deleteCategory: (id: number) =>
    apiRequest.delete(`/categories/${id}`),

  // Features
  getFeatures: (categoryId: number) =>
    apiRequest.get<{ items: Feature[] }>('/features', { categoryId }),

  createFeature: (data: {
    categoryId: number;
    name: string;
    key?: string;
    dataType: 'string' | 'number' | 'boolean' | 'date' | 'enum';
    enumValues?: string[];
  }) =>
    apiRequest.post('/features', data),

  updateFeature: (id: number, data: {
    name?: string;
    key?: string;
    dataType?: 'string' | 'number' | 'boolean' | 'date' | 'enum';
    enumValues?: string[];
  }) =>
    apiRequest.put(`/features/${id}`, data),

  deleteFeature: (id: number) =>
    apiRequest.delete(`/features/${id}`),
};