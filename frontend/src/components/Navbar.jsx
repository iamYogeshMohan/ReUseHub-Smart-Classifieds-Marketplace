import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, PlusCircle, User as UserIcon, LogOut, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${search}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-primary-600 tracking-tight">
              ReUseHub
            </Link>
            <form onSubmit={handleSearch} className="hidden md:flex relative max-w-lg w-96">
              <input
                type="text"
                placeholder="Search for anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/post-ad" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Sell</span>
                </Link>
                <Link to="/chat" className="p-2 text-gray-500 hover:text-primary-600 transition-colors relative">
                  <MessageSquare className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-3 border-l pl-4 ml-2">
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                    <img src={user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="avatar" className="h-8 w-8 rounded-full border border-gray-200" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Link>
                  <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 pb-1">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
