import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { Footer, Header } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CasesPage } from './pages/CasesPage';
import { ContactsPage } from './pages/ContactsPage';
import { AdminDashboard } from './pages/AdminDashboard';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<Navigate to="/cases" replace />} />
          <Route path="/catalog/:slug" element={<Navigate to="/cases" replace />} />
          <Route path="/solutions" element={<Navigate to="/cases" replace />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;
