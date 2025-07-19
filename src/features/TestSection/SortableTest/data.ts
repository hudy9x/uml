import { Category, UMLProject } from '@/databases/_types';

// Sample Categories
export const dummyCategories: Category[] = [
  {
    id: 'cat_1',
    name: 'System Architecture',
    description: 'High-level system design diagrams',
    position: 100.0,
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z'
  },
  {
    id: 'cat_2',
    name: 'Database Schema',
    description: 'Database entity relationships and structures',
    position: 200.0,
    created_at: '2024-03-20T10:30:00Z',
    updated_at: '2024-03-20T10:30:00Z'
  },
  {
    id: 'cat_3',
    name: 'Class Diagrams',
    description: 'Object-oriented class relationships',
    position: 300.0,
    created_at: '2024-03-20T11:00:00Z',
    updated_at: '2024-03-20T11:00:00Z'
  }
];

// Sample UML Projects
const content = `@startuml
title E-commerce System Architecture
cloud "Frontend" {
  [Web App]
  [Mobile App]
}
`;
export const dummyProjects: UMLProject[] = [
  {
    id: 'proj_1',
    name: 'E-commerce System Overview',
    content,
    position: 100.0,
    created_at: '2024-03-20T10:05:00Z',
    updated_at: '2024-03-20T10:05:00Z',
    is_deleted: 0,
    type: 'system'
  },
  {
    id: 'proj_2',
    name: 'Authentication Flow',
    content,
    position: 200.0,
    created_at: '2024-03-20T10:10:00Z',
    updated_at: '2024-03-20T10:10:00Z',
    is_deleted: 0,
    type: 'sequence'
  },
  {
    id: 'proj_3',
    name: 'User Entity Schema',
    content,
    position: 300.0,
    created_at: '2024-03-20T10:35:00Z',
    updated_at: '2024-03-20T10:35:00Z',
    is_deleted: 0,
    type: 'entity'
  },
  {
    id: 'proj_4',
    name: 'Order Management Schema',
    content,
    position: 400.0,
    created_at: '2024-03-20T10:40:00Z',
    updated_at: '2024-03-20T10:40:00Z',
    is_deleted: 0,
    type: 'entity'
  },
  {
    id: 'proj_5',
    name: 'User Management Classes',
    content,
    position: 500.0,
    created_at: '2024-03-20T11:05:00Z',
    updated_at: '2024-03-20T11:05:00Z',
    is_deleted: 0,
    type: 'class'
  },
  {
    id: 'proj_6',
    name: 'Product Management Classes',
    content,
    position: 600.0,
    created_at: '2024-03-20T11:10:00Z',
    updated_at: '2024-03-20T11:10:00Z',
    is_deleted: 0,
    type: 'class'
  }
];

// Content Categories relationships
export const dummyContentCategories = [
  { project_id: 'proj_1', category_id: 'cat_1' },
  { project_id: 'proj_2', category_id: 'cat_1' },
  { project_id: 'proj_3', category_id: 'cat_2' },
  { project_id: 'proj_4', category_id: 'cat_2' },
  { project_id: 'proj_5', category_id: 'cat_3' },
  { project_id: 'proj_6', category_id: 'cat_3' }
];
