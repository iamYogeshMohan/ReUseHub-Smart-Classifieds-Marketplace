import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostAd from './pages/PostAd';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <main className="flex-1 bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post-ad" element={<PostAd />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </main>
          
          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center z-10 relative">
              <span className="text-xl font-black text-primary-600 block mb-4 md:mb-0">ReUseHub</span>
              <p className="text-gray-500 text-sm font-medium text-center">&copy; 2026 ReUseHub Marketplace. Built for a better tomorrow.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
