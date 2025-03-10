interface User {
  id: string;
  username: string;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  price?: number;
  takenAt: string;
  user: User;
}

export interface Pagination {
  currentPage: number;
  perPage: number;
  totalPages: number;
}
