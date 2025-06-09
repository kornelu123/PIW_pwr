// app/routes/home.jsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../root.jsx';
import { db } from '../firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFavorites } from '../contexts/items.jsx';

export function meta() {
  return [
    { title: "Book Search" },
    { name: "description", content: "Search and manage books" },
  ];
}

const genres = ["Fiction", "Dystopian", "Romance", "Fantasy"];

export default function Home() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const { state: favoritesState, dispatch } = useFavorites();
  const [filters, setFilters] = useState({
    searchTerm: "",
    genre: "",
    inStock: false,
    maxPrice: "",
    myBooksOnly: false,
  });

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const bookData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(bookData);
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesGenre = filters.genre === "" || book.genre === filters.genre;
      const matchesStock = !filters.inStock || book.inStock;
      const matchesPrice = filters.maxPrice === "" || book.price <= Number(filters.maxPrice);
      const matchesOwner = !filters.myBooksOnly || (user && book.ownerId === user.uid);
      return matchesSearch && matchesGenre && matchesStock && matchesPrice && matchesOwner;
    });
  }, [books, filters, user]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const toggleMyBooks = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      myBooksOnly: !prev.myBooksOnly,
    }));
  }, []);

  const updateBook = async (id, updates) => {
    const bookRef = doc(db, 'books', id);
    await updateDoc(bookRef, updates);
    setBooks(books.map((book) => (book.id === id ? { ...book, ...updates } : book)));
  };

  const deleteBook = async (id) => {
    await deleteDoc(doc(db, 'books', id));
    setBooks(books.filter((book) => book.id !== id));
  };

  const addToFavorites = (book) => {
    if (!favoritesState.favorites.find((fav) => fav.id === book.id)) {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: book });
    }
  };

  return (
    <main className="pt-16 p-4 container mx-auto max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Book Search</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
          {user && (
            <button
              onClick={toggleMyBooks}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                filters.myBooksOnly
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              } hover:bg-blue-600 hover:text-white transition`}
            >
              MOJE
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Search</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Title or author..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Genre</label>
            <select
              name="genre"
              value={filters.genre}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="$ Max..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No books found.</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <ul className="book-list space-y-4">
            {filteredBooks.map((book) => (
              <li
                key={book.id}
                className="book-item border-b border-gray-200 dark:border-gray-700 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{book.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{book.genre}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">${book.price.toFixed(2)}</div>
                  <div className="flex items-center">
                    {user && book.ownerId === user.uid && (
                      <input
                        type="checkbox"
                        checked={book.inStock}
                        onChange={() => updateBook(book.id, { inStock: !book.inStock })}
                        className="h-4 w-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                    )}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      {book.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToFavorites(book)}
                      disabled={favoritesState.favorites.find((fav) => fav.id === book.id)}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 transition disabled:bg-gray-500"
                    >
                      Add to Favorites
                    </button>
                    {user && book.ownerId === user.uid && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
