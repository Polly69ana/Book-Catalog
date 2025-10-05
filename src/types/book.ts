export interface Book {
  id: string;
  title: string;
  author: string;
  director?: string;
  year: number;
  genre: string;
  synopsis: string;
  rating: number;
  coverUrl: string;
  type: 'book' | 'film';
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  director?: string;
  year: number;
  genre: string;
  synopsis: string;
  rating: number;
  coverUrl: string;
  type: 'book' | 'film';
}