import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [category, setCategory] = useState('');
  
  const categories = ['Electronics', 'Vehicles', 'Furniture', 'Fashion', 'Sports', 'Books', 'Other'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?search=${search}`;
        if (category) url += `&category=${category}`;
        const res = await api.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category]);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary-50 rounded-3xl p-8 mb-10 overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Find what you need.<br/>
            <span className="text-primary-600">Sell what you don't.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Join the fastest growing marketplace to buy and sell locally. Awesome products, incredible deals.
          </p>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            <button 
              onClick={() => setCategory('')} 
              className={`px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors whitespace-nowrap ${category === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors whitespace-nowrap ${category === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {search ? `Search results for "${search}"` : 'Fresh Recommendations'}
            </h2>
            <span className="text-sm text-gray-500 font-medium">{products.length} items</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100 p-4">
                  <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="text-gray-400 mb-2">No products found</div>
              <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
