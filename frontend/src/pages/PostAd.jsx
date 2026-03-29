import { useState, useContext } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, X } from 'lucide-react';

export default function PostAd() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'Good',
    location: '',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Convert to base64 for simplicity since Cloudinary wasn't heavily requested in API constraints
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        images
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post ad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-6 drop-shadow-sm">Post an Ad</h2>
        
        {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Product Details</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Title *</label>
              <input required type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 border focus:border-transparent transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                <select className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 border focus:border-transparent transition-all font-medium" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Electronics</option>
                  <option>Vehicles</option>
                  <option>Furniture</option>
                  <option>Fashion</option>
                  <option>Sports</option>
                  <option>Books</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Condition *</label>
                <select className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 border focus:border-transparent transition-all font-medium" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
              <textarea required rows="4" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 border focus:border-transparent transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($) *</label>
                <input required type="number" min="0" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 border focus:border-transparent transition-all font-bold text-gray-900" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 border focus:border-transparent transition-all" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Upload Photos</h3>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer relative">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 bg-white shadow-sm">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl shadow-lg shadow-gray-400 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all disabled:opacity-70 text-lg"
            >
              {loading ? 'Posting...' : 'Post Ad Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
