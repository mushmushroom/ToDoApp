export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categories: {
    id: string;
    name: string;
  } | null;
}

export interface Category {
  id: string;
  name: string;
}

export type DialogMode = 'add' | 'edit';


