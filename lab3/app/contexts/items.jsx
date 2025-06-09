// app/contexts/items.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  favorites: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_FAVORITES': {
      return { ...state, favorites: action.payload };
    }
    case 'ADD_TO_FAVORITES': {
      const updatedFavorites = [...state.favorites, action.payload];
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }
      return { ...state, favorites: updatedFavorites };
    }
    case 'REMOVE_FROM_FAVORITES': {
      const updatedFavorites = state.favorites.filter(
        (book) => book.id !== action.payload.id
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }
      return { ...state, favorites: updatedFavorites };
    }
    default:
      return state;
  }
};

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      dispatch({ type: 'INITIALIZE_FAVORITES', payload: savedFavorites });
    }
  }, []);

  return (
    <FavoritesContext.Provider value={{ state, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
