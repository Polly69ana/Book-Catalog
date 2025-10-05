import { useState, useEffect } from 'react';
import { Book, BookFormData } from '../types/book';
import { StarRating } from './StarRating';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface BookFormProps {
  book?: Book;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
}

const genres = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
  'Fantasy', 'Biography', 'History', 'Drama', 'Comedy', 'Action', 
  'Adventure', 'Documentary', 'Thriller', 'Horror'
];

export function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    director: '',
    year: new Date().getFullYear(),
    genre: '',
    synopsis: '',
    rating: 0,
    coverUrl: '',
    type: 'book'
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        director: book.director || '',
        year: book.year,
        genre: book.genre,
        synopsis: book.synopsis,
        rating: book.rating,
        coverUrl: book.coverUrl,
        type: book.type
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.genre || !formData.synopsis) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  const updateField = (field: keyof BookFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">
            {book ? 'Edit Item' : 'Add New Item'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value: 'book' | 'film') => updateField('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">📚 Book</SelectItem>
                  <SelectItem value="film">🎬 Film</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter title..."
                className="focus:border-blue-500"
              />
            </div>

            {/* Author/Director */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">
                  {formData.type === 'book' ? 'Author' : 'Author/Writer'} *
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => updateField('author', e.target.value)}
                  placeholder={formData.type === 'book' ? 'Enter author...' : 'Enter author/writer...'}
                  className="focus:border-blue-500"
                />
              </div>
              {formData.type === 'film' && (
                <div>
                  <Label htmlFor="director">Director</Label>
                  <Input
                    id="director"
                    value={formData.director}
                    onChange={(e) => updateField('director', e.target.value)}
                    placeholder="Enter director..."
                    className="focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Year and Genre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">
                  {formData.type === 'book' ? 'Publication Year' : 'Release Year'} *
                </Label>
                <Input
                  id="year"
                  type="number"
                  min="1000"
                  max="2030"
                  value={formData.year}
                  onChange={(e) => updateField('year', parseInt(e.target.value))}
                  className="focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="genre">Genre *</Label>
                <Select value={formData.genre} onValueChange={(value) => updateField('genre', value)}>
                  <SelectTrigger className="focus:border-blue-500">
                    <SelectValue placeholder="Select genre..." />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cover URL */}
            <div>
              <Label htmlFor="coverUrl">Cover Image URL</Label>
              <Input
                id="coverUrl"
                value={formData.coverUrl}
                onChange={(e) => updateField('coverUrl', e.target.value)}
                placeholder="https://example.com/cover.jpg"
                className="focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for default image
              </p>
            </div>

            {/* Rating */}
            <div>
              <Label>Rating *</Label>
              <div className="flex items-center gap-2 mt-2">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) => updateField('rating', rating)}
                  size="lg"
                />
                <Badge variant="outline" className="text-blue-600">
                  {formData.rating}/5 stars
                </Badge>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <Label htmlFor="synopsis">Synopsis *</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => updateField('synopsis', e.target.value)}
                placeholder="Enter a brief synopsis..."
                rows={4}
                className="focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {book ? 'Update Item' : 'Add Item'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}