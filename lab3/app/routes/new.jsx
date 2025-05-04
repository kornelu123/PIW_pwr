// routes/new.jsx
import { useState } from 'react';
import { useBooks } from '../root.jsx';
import { useNavigate } from 'react-router-dom';

export function meta() {
  return [
    { title: "Add New Book" },
    { name: "description", content: "Add a new book to the collection" },
  ];
}

export default function NewBook() {
  const { books, setBooks } = useBooks();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    inStock: false,
  });

  const genres = ["Fiction", "Dystopian", "Romance", "Fantasy"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = {
      id: books.length + 1, // Simple ID generation (replace with UUID in production)
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      price: parseFloat(formData.price) || 0,
      inStock: formData.inStock,
    };
    setBooks([...books, newBook]);
    navigate('/'); // Redirect to home after adding
  };

  return (
    <main className="pt-16 p-4 container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Add New Book</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Book title..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Author name..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Genre</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            >
              <option value="">Select Genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="$ Price..."
              step="0.01"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              id="inStockNew"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="inStockNew" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              In Stock
            </label>
          </div>
          <div className="sm:col-span-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
