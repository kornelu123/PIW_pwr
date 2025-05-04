import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useOutletContext,
  Routes,
  Route,
  Link  // Add this import
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import Home from './routes/home.jsx';
import NewBook from './routes/new.jsx';
import Login from './routes/login.jsx';
import Register from './routes/register.jsx';
import './app.css';

export const links = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function RootLayout() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppLayout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
        <nav className='container mx-auto px-4 py-3 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <Link to="/" className='text-xl font-bold'>📚 Book Search</Link>
          </div>
          <div className='flex space-x-4'>
            <Link to="/" className='text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition'>
              Home
            </Link>
            <Link to="/new" className='text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition'>
              Add Book
            </Link>
            {user ? (
              <>
                <Link to="/my-books" className='text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition'>
                  My Books
                </Link>
                <button
                  onClick={() => auth.signOut()}
                  className='text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className='text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition'>
                  Login
                </Link>
                <Link to="/register" className='text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition'>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet context={{ user }} />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='new' element={<NewBook />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='my-books' element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
}

export function useAuth() {
  return useOutletContext();
}
