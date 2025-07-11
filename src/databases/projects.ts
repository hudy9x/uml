import { getDB } from './_db';
import { UMLProject } from './_types';

// Generate random string of 4-6 characters
const generateRandomString = () => {
  const length = Math.floor(Math.random() * 3) + 4; // Random length between 4-6
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export function detectUMLType(content: string): string {
  const lowerContent = content.toLowerCase();
  
  // Check for specific UML diagram keywords
  if (lowerContent.includes('@startuml')) {
    if (lowerContent.includes('class ') || lowerContent.includes('interface ')) {
      return 'class';
    }
    if (lowerContent.includes('actor ') || lowerContent.includes('usecase ')) {
      return 'use-case';
    }
    if (lowerContent.includes('participant ') || lowerContent.includes('->') || lowerContent.includes('-->')) {
      return 'sequence';
    }
    if (lowerContent.includes('start') || lowerContent.includes('activity') || lowerContent.includes('fork') || lowerContent.includes('end')) {
      return 'activity';
    }
    if (lowerContent.includes('state ') || lowerContent.includes('[*]')) {
      return 'state';
    }
    if (lowerContent.includes('component ') || lowerContent.includes('interface ')) {
      return 'component';
    }
    if (lowerContent.includes('package ') || lowerContent.includes('node ')) {
      return 'deployment';
    }
  }

  console.log('lowerContent', lowerContent, lowerContent.includes('startgantt'))
  if (lowerContent.includes('startgantt')) {
    console.log('gantt')
    return 'gantt';
  }
  
  return 'unknown';
}

export async function createProject(name: string = 'Untitled UML', type?: string): Promise<UMLProject> {
  const db = await getDB();
  const defaultContent = `@startuml\nclass Example\n@enduml`;
  const nameWithSuffix = `${name}-${generateRandomString()}`;
  const project: UMLProject = {
    id: crypto.randomUUID(),
    name: nameWithSuffix,
    content: defaultContent,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: 0,
    type: type || detectUMLType(defaultContent)
  };
  
  await db.execute(
    'INSERT INTO uml_projects (id, name, content, created_at, updated_at, is_deleted, type) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [project.id, project.name, project.content, project.created_at, project.updated_at, project.is_deleted, project.type]
  );
  
  return project;
}

export async function getProject(id: string): Promise<UMLProject | undefined> {
  const db = await getDB();
  const result = await db.select<UMLProject[]>(
    'SELECT * FROM uml_projects WHERE id = $1',
    [id]
  );
  return result[0];
}

export async function updateProject(
  id: string, 
  updates: Partial<Pick<UMLProject, 'content' | 'name' | 'type'>>
): Promise<void> {
  const db = await getDB();
  const now = new Date().toISOString();
  
  // If content is updated, automatically detect and update the type
  if (updates.content !== undefined) {
    const detectedType = detectUMLType(updates.content);
    await db.execute(
      'UPDATE uml_projects SET content = $1, type = $2, updated_at = $3 WHERE id = $4',
      [updates.content, detectedType, now, id]
    );
  }
  
  if (updates.name !== undefined) {
    await db.execute(
      'UPDATE uml_projects SET name = $1, updated_at = $2 WHERE id = $3',
      [updates.name, now, id]
    );
  }

  if (updates.type !== undefined) {
    await db.execute(
      'UPDATE uml_projects SET type = $1, updated_at = $2 WHERE id = $3',
      [updates.type, now, id]
    );
  }
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  const now = new Date().toISOString();
  
  await db.execute(
    'UPDATE uml_projects SET is_deleted = 1, updated_at = $1 WHERE id = $2',
    [now, id]
  );
}

export async function listProjects(): Promise<UMLProject[]> {
  const db = await getDB();
  return await db.select<UMLProject[]>(
    'SELECT * FROM uml_projects WHERE is_deleted = 0 ORDER BY updated_at DESC'
  );
}

export async function getDeletedProjects(): Promise<UMLProject[]> {
  const db = await getDB();
  return await db.select<UMLProject[]>(
    'SELECT * FROM uml_projects WHERE is_deleted = 1 ORDER BY updated_at DESC'
  );
}

export async function restoreProject(id: string): Promise<void> {
  const db = await getDB();
  const now = new Date().toISOString();
  
  await db.execute(
    'UPDATE uml_projects SET is_deleted = 0, updated_at = $1 WHERE id = $2',
    [now, id]
  );
}

export async function permanentlyDeleteProject(id: string): Promise<void> {
  const db = await getDB();
  await db.execute(
    'DELETE FROM uml_projects WHERE id = $1',
    [id]
  );
}
