import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetail from "../pages/ProductDetail";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Favorites from "../pages/Favorites";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import CreateAd from "../pages/CreateAd";
import Categories from "../pages/Categories";
import CategoryDetail from "../pages/CategoryDetail";
import Offers from "../pages/Offers";
import MyProducts from "../pages/MyProducts";
import EditProduct from "../pages/EditProduct";
import EditProfile from "../pages/EditProfile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-dark">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ads/create" element={<CreateAd />} />

            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/ads/edit/:id" element={<EditProduct />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
