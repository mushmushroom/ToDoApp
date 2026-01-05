export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categories: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
}
