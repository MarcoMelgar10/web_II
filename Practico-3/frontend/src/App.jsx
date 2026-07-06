import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreatorProfilePage from "./pages/creator/CreatorProfilePage";
import CreatePostPage from "./pages/creator/CreatePostPage";
import IncomeReportPage from "./pages/creator/IncomeReportPage";

import FeedPage from "./pages/follower/FeedPage";
import CreatorsListPage from "./pages/follower/CreatorsListPage";
import CreatorProfileViewPage from "./pages/follower/CreatorProfileViewPage";
import FavoritesPage from "./pages/follower/FavoritesPage";
import DonationHistoryPage from "./pages/follower/DonationHistoryPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/unauthorized"
              element={
                <div className="page">
                  <h1>Acceso denegado</h1>
                  <p>No tenes permisos para ver esta pagina.</p>
                </div>
              }
            />

            <Route
              path="/creator/dashboard"
              element={
                <ProtectedRoute requiredRole="CREATOR">
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/profile"
              element={
                <ProtectedRoute requiredRole="CREATOR">
                  <CreatorProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/posts/new"
              element={
                <ProtectedRoute requiredRole="CREATOR">
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/income"
              element={
                <ProtectedRoute requiredRole="CREATOR">
                  <IncomeReportPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/follower/feed"
              element={
                <ProtectedRoute requiredRole="FOLLOWER">
                  <FeedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/follower/creators"
              element={
                <ProtectedRoute requiredRole="FOLLOWER">
                  <CreatorsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/follower/creators/:id"
              element={
                <ProtectedRoute requiredRole="FOLLOWER">
                  <CreatorProfileViewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/follower/favorites"
              element={
                <ProtectedRoute requiredRole="FOLLOWER">
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/follower/donations"
              element={
                <ProtectedRoute requiredRole="FOLLOWER">
                  <DonationHistoryPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
