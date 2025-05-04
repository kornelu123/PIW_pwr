import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Add Link import
import { auth, googleProvider } from '../firebase.js';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../root.jsx';

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Log in to your account" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      // ... error handling remains the same ...
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      // ... error handling remains the same ...
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* ... rest of your login form ... */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
      </p>
    </div>
  );
}
