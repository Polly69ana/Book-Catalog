import { Book, BookFormData } from '../types/book';

const STORAGE_KEY = 'book-catalog';

export const storage = {
  getBooks(): Book[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBooks(books: Book[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  },

  addBook(bookData: BookFormData): Book {
    const books = this.getBooks();
    const newBook: Book = {
      ...bookData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    books.push(newBook);
    this.saveBooks(books);
    return newBook;
  },

  updateBook(id: string, bookData: BookFormData): Book | null {
    const books = this.getBooks();
    const index = books.findIndex(book => book.id === id);
    if (index === -1) return null;
    
    const updatedBook: Book = {
      ...books[index],
      ...bookData,
      updatedAt: new Date().toISOString(),
    };
    books[index] = updatedBook;
    this.saveBooks(books);
    return updatedBook;
  },

  deleteBook(id: string): boolean {
    const books = this.getBooks();
    const filtered = books.filter(book => book.id !== id);
    if (filtered.length === books.length) return false;
    
    this.saveBooks(filtered);
    return true;
  },

  getBookById(id: string): Book | null {
    const books = this.getBooks();
    return books.find(book => book.id === id) || null;
  },

  searchBooks(query: string): Book[] {
    const books = this.getBooks();
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) return books;
    
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      (book.director && book.director.toLowerCase().includes(lowerQuery))
    );
  }
};