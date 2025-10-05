import { Book } from '../types/book';
import { StarRating } from './StarRating';
import { Edit, Trash2, Calendar, User, Film } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView: (book: Book) => void;
}

export function BookCard({ book, onEdit, onDelete, onView }: BookCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300">
      <div className="relative">
        <img
          src={book.coverUrl}
          alt={`${book.title} cover`}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={() => onView(book)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&q=80`;
          }}
        />
        <div className="absolute top-2 left-2">
          <Badge variant={book.type === 'book' ? 'default' : 'secondary'} className="bg-blue-600 hover:bg-blue-700">
            {book.type === 'book' ? (
              <>📚 Book</>
            ) : (
              <>🎬 Film</>
            )}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(book)}
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(book.id)}
              className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 
            className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
            onClick={() => onView(book)}
          >
            {book.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <User className="h-3 w-3 mr-1" />
            {book.type === 'book' ? book.author : book.director || book.author}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {book.year}
            </div>
            <StarRating rating={book.rating} readonly size="sm" />
          </div>
        </div>
        
        <Badge variant="outline" className="mb-2 text-xs text-blue-600 border-blue-200">
          {book.genre}
        </Badge>
        
        <p className="text-sm text-gray-600 line-clamp-3">
          {book.synopsis}
        </p>
      </div>
    </Card>
  );
}