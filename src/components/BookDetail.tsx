import { Book } from '../types/book';
import { StarRating } from './StarRating';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { X, Edit, Trash2, Calendar, User, FileText } from 'lucide-react';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export function BookDetail({ book, onClose, onEdit, onDelete }: BookDetailProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-6">
              <img
                src={book.coverUrl}
                alt={`${book.title} cover`}
                className="w-32 h-48 object-cover rounded-lg shadow-lg border-2 border-white/20"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&q=80`;
                }}
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge 
                      variant="secondary" 
                      className="mb-2 bg-white/20 text-white border-white/30"
                    >
                      {book.type === 'book' ? '📚 Book' : '🎬 Film'}
                    </Badge>
                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                    <div className="flex items-center gap-4 text-blue-100 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{book.type === 'book' ? book.author : book.director || book.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{book.year}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRating rating={book.rating} readonly size="lg" />
                      <span className="text-lg font-semibold">{book.rating}/5</span>
                    </div>
                  </div>
                </div>
                
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                  {book.genre}
                </Badge>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Synopsis</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {book.synopsis}
              </p>
            </div>

            {/* Additional Info */}
            {book.type === 'film' && book.director && book.director !== book.author && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Writer</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Director</h3>
                  <p className="text-gray-600">{book.director}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-sm text-gray-500 mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><strong>Added:</strong> {new Date(book.createdAt).toLocaleDateString()}</p>
                <p><strong>Updated:</strong> {new Date(book.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => onEdit(book)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Item
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}