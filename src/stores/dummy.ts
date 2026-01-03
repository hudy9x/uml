import { atom } from 'jotai';

// Dummy counter atom
export const counterAtom = atom(0);

// Dummy text atom
export const textAtom = atom('Hello World');

// Dummy boolean atom
export const isActiveAtom = atom(false);

// Dummy object atom
export const userAtom = atom({
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
});

// Dummy array atom
export const itemsAtom = atom<string[]>(['Item 1', 'Item 2', 'Item 3']);

// Derived atom example - computed from counterAtom
export const doubleCounterAtom = atom((get) => get(counterAtom) * 2);

// Write-only atom example
export const incrementCounterAtom = atom(
  null,
  (get, set) => {
    set(counterAtom, get(counterAtom) + 1);
  }
);

