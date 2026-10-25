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
import ProfilePage from "./features/auth/pages/ProfilePage"; 

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:id" element={<DetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Rute Login & Register Original */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* TAMBAHAN: Rute untuk Delcom Grading */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          {/* Pastikan path ini sama persis dengan yang ada di layar Delcom */}
          <Route path="/sell" element={<SellPage />} />
          <Route path="/mine" element={<MyItemsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/chat/:itemId" element={<ChatPage />} />
          <Route path="/messages" element={<MessagesListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}