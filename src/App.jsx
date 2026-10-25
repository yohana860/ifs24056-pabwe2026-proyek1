import { Route, Routes } from "react-router-dom";
import MainLayout from "./features/common/layouts/MainLayout";
import ProtectedRoute from "./features/common/components/ProtectedRoute";
import NotFoundPage from "./features/common/pages/NotFoundPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import HomePage from "./features/items/pages/HomePage";
import DetailPage from "./features/items/pages/DetailPage";
import SellPage from "./features/items/pages/SellPage";
import MyItemsPage from "./features/items/pages/MyItemsPage";
import FavoritesPage from "./features/favorites/pages/FavoritesPage";
import CartPage from "./features/cart/pages/CartPage";
import ChatPage from "./features/chat/pages/ChatPage";
import MessagesListPage from "./features/chat/pages/MessagesListPage";
// 1. Tambahkan import ProfilePage
import ProfilePage from "./features/auth/pages/ProfilePage"; 

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:id" element={<DetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/sell" element={<SellPage />} />
          <Route path="/mine" element={<MyItemsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/chat/:itemId" element={<ChatPage />} />
          <Route path="/messages" element={<MessagesListPage />} />
          
          {/* 2. Tambahkan Route Profile di sini */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}