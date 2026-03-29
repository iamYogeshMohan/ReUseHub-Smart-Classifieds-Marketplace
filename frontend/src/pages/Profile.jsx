import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [loadingFile, setLoadingFile] = useState(false);
  const fileInputRef = useRef(null);

  if (!user) return <div className="p-8 text-center text-xl">Please log in.</div>;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingFile(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        await updateProfile(reader.result);
      } catch (error) {
        console.error("Failed to update avatar:", error);
      } finally {
        setLoadingFile(false);
      }
    };
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-900 h-32 relative"></div>
        <div className="px-8 pb-8 flex flex-col items-center -mt-16">
          <div 
            className="relative group cursor-pointer" 
            onClick={() => fileInputRef.current?.click()}
          >
            <img 
              src={user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
              alt="Profile" 
              className={`w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white transition-opacity ${loadingFile ? 'opacity-50' : 'group-hover:opacity-80'}`} 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/30">
              <Camera className="w-8 h-8 text-white z-10" />
            </div>
            {loadingFile && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mt-4">{user.username}</h1>
          <p className="text-gray-500 font-medium mb-6">{user.email}</p>
          
          <button onClick={logout} className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 transition-colors">
            Log Out
          </button>
        </div>

        <div className="border-t border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">My Dashboard</h2>
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            More features coming soon (My Ads, Saved Items).
          </div>
        </div>
      </div>
    </div>
  );
}
