// contexts/items.jsx
import { createContext, useContext, useState } from "react";

const ItemsContext = createContext();

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", category: "Electronics", price: 100, inStock: true },
    { id: 2, name: "Item 2", category: "Clothing", price: 50, inStock: false },
    { id: 3, name: "Item 3", category: "Books", price: 20, inStock: true },
    { id: 4, name: "Item 4", category: "Electronics", price: 200, inStock: true },
    { id: 5, name: "Item 5", category: "Home", price: 150, inStock: false },
  ]);

  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    inStock: false,
    maxPrice: "",
  });

  const updateItem = (id, updatedData) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesStock = !filters.inStock || item.inStock;
    const matchesPrice = !filters.maxPrice || item.price <= Number(filters.maxPrice);
    
    return matchesSearch && matchesCategory && matchesStock && matchesPrice;
  });

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <ItemsContext.Provider value={{
      items: filteredItems,
      filters,
      setFilters,
      updateItem,
      categories,
    }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  return useContext(ItemsContext);
}
