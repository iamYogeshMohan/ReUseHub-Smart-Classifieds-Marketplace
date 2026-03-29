import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, User, Clock, ShieldCheck, Tag, MessageCircle } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleMessageSeller = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to chat with seller ID
    navigate(`/chat?userId=${product.seller._id}&product=${product._id}`);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto py-12 px-4 flex justify-center h-96 items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
  
  if (!product) return <div className="text-center py-20 text-xl font-medium text-gray-500">Product not found.</div>;

  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        <div className="flex flex-col lg:flex-row">
          
          {/* Images Section */}
          <div className="lg:w-[55%] p-6">
            <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-inner">
              <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-contain" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === idx ? 'border-primary-600 ring-2 ring-primary-100 ring-offset-2' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:w-[45%] p-8 lg:p-12 lg:border-l border-gray-100 bg-gray-50/30 flex flex-col h-full">
            <div className="mb-6 flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-gray-900 text-white rounded-md text-xs font-bold uppercase tracking-wider">{product.category}</span>
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-md text-xs font-bold uppercase tracking-wider">{product.condition}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
              {product.title}
            </h1>
            
            <p className="text-4xl font-bold text-primary-600 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm inline-block shadow-primary-500/10">
              ${product.price.toLocaleString()}
            </p>

            <div className="space-y-6 flex-grow mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-400" /> Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-400 flex items-center gap-1.5"><MapPin className="w-4 h-4"/> Location</span>
                  <span className="font-semibold text-gray-900 text-lg truncate">{product.location}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-400 flex items-center gap-1.5"><Clock className="w-4 h-4"/> Posted</span>
                  <span className="font-semibold text-gray-900 text-lg">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Seller Info box */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mt-auto shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={product.seller.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="Seller" className="w-14 h-14 rounded-full border border-gray-200" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{product.seller.username}</h4>
                    <span className="text-xs text-green-600 font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> Verified Seller</span>
                  </div>
                </div>
              </div>
              
              {(user?._id || user?.id) !== product.seller._id && (
                <button 
                  onClick={handleMessageSeller}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors shadow-md shadow-gray-900/20 text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message Seller
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
