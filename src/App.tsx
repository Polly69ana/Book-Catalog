import { useState, useEffect } from 'react';
import { Book } from './types/book';
import { storage } from './lib/storage';
import { BookCard } from './components/BookCard';
import { BookForm } from './components/BookForm';
import { BookDetail } from './components/BookDetail';
import { SearchBar } from './components/SearchBar';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card, CardContent } from './components/ui/card';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import { Plus, BookOpen, Film, Library, Star } from 'lucide-react';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = storage.searchBooks(searchQuery);
      setFilteredBooks(results);
    } else {
      setFilteredBooks(books);
    }
  }, [books, searchQuery]);

  const loadBooks = () => {
    const loadedBooks = storage.getBooks();
    setBooks(loadedBooks);
  };

  const handleAddBook = (bookData: any) => {
    try {
      const newBook = storage.addBook(bookData);
      loadBooks();
      setShowForm(false);
      toast({
        title: "Success!",
        description: `${newBook.title} has been added to your catalog.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditBook = (bookData: any) => {
    if (!editingBook) return;
    
    try {
      const updatedBook = storage.updateBook(editingBook.id, bookData);
      if (updatedBook) {
        loadBooks();
        setEditingBook(null);
        setShowForm(false);
        toast({
          title: "Success!",
          description: `${updatedBook.title} has been updated.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBook = (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        const success = storage.deleteBook(id);
        if (success) {
          loadBooks();
          toast({
            title: "Deleted",
            description: `${book.title} has been removed from your catalog.`,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const totalBooks = books.filter(b => b.type === 'book').length;
  const totalFilms = books.filter(b => b.type === 'film').length;
  const avgRating = books.length > 0 
    ? (books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Library className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Book Catalog</h1>
                <p className="text-gray-600">Manage your books and films collection</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-blue-600">{books.length}</p>
                </div>
                <Library className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Books</p>
                  <p className="text-3xl font-bold text-green-600">{totalBooks}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Films</p>
                  <p className="text-3xl font-bold text-purple-600">{totalFilms}</p>
                </div>
                <Film className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-yellow-600">{avgRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar 
            onSearch={setSearchQuery}
            className="max-w-md"
          />
          {searchQuery && (
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-600">
                {filteredBooks.length} result{filteredBooks.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Badge>
            </div>
          )}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <Library className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {books.length === 0 ? 'No items in your catalog yet' : 'No items found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {books.length === 0 
                    ? 'Start building your collection by adding your first book or film!'
                    : 'Try adjusting your search terms or clear the search to see all items.'
                  }
                </p>
                {books.length === 0 && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Item
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDeleteBook}
                onView={setSelectedBook}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <BookForm
          book={editingBook || undefined}
          onSubmit={editingBook ? handleEditBook : handleAddBook}
          onCancel={handleCloseForm}
        />
      )}

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onEdit={handleEdit}
          onDelete={handleDeleteBook}
        />
      )}

      <Toaster />
    </div>
  );
}

export default App;