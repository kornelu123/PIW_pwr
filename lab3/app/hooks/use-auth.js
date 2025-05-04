import { useOutletContext } from 'react-router-dom';

export function useAuth() {
  const context = useOutletContext();
  return context || { user: null }; // Fallback for SSR
}
