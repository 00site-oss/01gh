import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Earn from './pages/Earn';
import Shop from './pages/Shop';
import Leaders from './pages/Leaders';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Tos from './pages/Tos';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import ProtectedAdmin from './components/ProtectedAdmin';

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Earn />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/leaders" element={<Leaders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/tos" element={<Tos />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<ProtectedAdmin><Admin /></ProtectedAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}
