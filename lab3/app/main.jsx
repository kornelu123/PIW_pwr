// root.jsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useOutletContext,
} from "react-router";
import { useState } from "react";
import "./app.css";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">📚 Book Search</span>
            </div>
            <div className="flex space-x-4">
              <a href="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
                Home
              </a>
              <a href="/new" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
                Add Book
              </a>
              <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
                Login
              </a>
            </div>
          </nav>
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", price: 10.99, inStock: true },
    { id: 2, title: "1984", author: "George Orwell", genre: "Dystopian", price: 8.99, inStock: false },
    { id: 3, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", price: 7.99, inStock: true },
    { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", price: 12.99, inStock: true },
  ]);

  return (
    <Outlet context={{ books, setBooks }} />
  );
}

export function useBooks() {
  return useOutletContext();
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{message}</h1>
      <p className="text-gray-600 dark:text-gray-300">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-md">
          <code className="text-sm text-gray-700 dark:text-gray-200">{stack}</code>
        </pre>
      )}
    </main>
  );
}
