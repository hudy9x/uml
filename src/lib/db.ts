import { openDB } from 'idb';

export interface UMLProject {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const dbName = 'uml-editor-db';
const storeName = 'uml-projects';

export async function initDB() {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
      }
    },
  });
}

export async function createProject(name: string = 'Untitled UML'): Promise<UMLProject> {
  const db = await initDB();
  const project: UMLProject = {
    id: crypto.randomUUID(),
    name,
    content: `@startuml\nclass Example\n@enduml`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await db.put(storeName, project);
  return project;
}

export async function getProject(id: string): Promise<UMLProject | undefined> {
  const db = await initDB();
  return db.get(storeName, id);
}

export async function updateProject(id: string, updates: Partial<Pick<UMLProject, 'content' | 'name'>>): Promise<void> {
  const db = await initDB();
  const project = await getProject(id);
  if (project) {
    await db.put(storeName, {
      ...project,
      ...updates,
      updatedAt: new Date(),
    });
  }
}

export async function listProjects(): Promise<UMLProject[]> {
  const db = await initDB();
  return db.getAllFromIndex(storeName, 'updatedAt');
}
