// routes/home.jsx
import { useState, useMemo } from 'react';
import { useBooks } from '../root.jsx';

export function meta() {
  return [
    { title: "Book Search" },
    { name: "description", content: "Search and manage books" },
  ];
}

// Available genres
const genres = ["Fiction", "Dystopian", "Romance", "Fantasy"];

export default function Home() {
  const { books, setBooks } = useBooks();
  const [filters, setFilters] = useState({
    searchTerm: "",
    genre: "",
    inStock: false,
    maxPrice: "",
  });

  // Filter books based on current filters
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesGenre = filters.genre === "" || book.genre === filters.genre;
      const matchesStock = !filters.inStock || book.inStock;
      const matchesPrice = filters.maxPrice === "" || book.price <= Number(filters.maxPrice);
      return matchesSearch && matchesGenre && matchesStock && matchesPrice;
    });
  }, [books, filters]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const updateBook = (id, updates) => {
    setBooks(books.map(book =>
      book.id === id ? { ...book, ...updates } : book
    ));
  };

  const deleteBook = (id) => {
    // Placeholder for delete functionality
    alert(`Delete book with ID ${id} (placeholder)`);
  };

  return (
    <main className="pt-16 p-4 container mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Book Search</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      {/* Search Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Search Term */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Search</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Title or author..."
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Genre</label>
            <select
              name="genre"
              value={filters.genre}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* In Stock */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              id="inStock"
              checked={filters.inStock}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              In Stock Only
            </label>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="$ Max..."
            />
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No books found.</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map(book => (
              <div
                key={book.id}
                className="border-b border-gray-200 dark:border-gray-700 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{book.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{book.genre}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">${book.price.toFixed(2)}</div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={book.inStock}
                      onChange={() => updateBook(book.id, { inStock: !book.inStock })}
                      className="h-4 w-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{book.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const newTitle = prompt("Enter new title:", book.title);
                        if (newTitle) {
                          updateBook(book.id, { title: newTitle });
                        }
                      }}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
