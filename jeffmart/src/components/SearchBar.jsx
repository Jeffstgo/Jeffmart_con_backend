import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesApi } from "../services/categories";

export default function SearchBar() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesApi.listCategories();
        const cats = Array.isArray(response) ? response : (response.items || response.data || []);
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/categories/${categorySlug}`);
  };

  return (
    <div className="w-full bg-dark px-6 py-4">
      <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
        <form onSubmit={handleSearch} className="flex items-center bg-[#29382E] text-text rounded-full px-4 py-2 flex-1">
          <FaSearch className="text-text-muted mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos, marcas y más..."
            className="bg-transparent outline-none w-full text-text placeholder:text-text-muted"
          />
        </form>
      </div>

      <div className="mt-4 flex gap-6 text-sm font-medium max-w-6xl mx-auto overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className="pb-2 border-b-2 border-transparent hover:border-primary text-text hover:text-primary transition whitespace-nowrap"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
