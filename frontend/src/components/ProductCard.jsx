import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <Link to={`/product/${product._id}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-100">
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-gray-900 shadow-sm">
            {product.condition}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1 truncate">
            {product.title}
          </h3>
          <p className="text-2xl font-bold text-primary-600 mb-2">
            ${product.price.toLocaleString()}
          </p>
          <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1.5 truncate pr-2">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            <span className="whitespace-nowrap text-xs">{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
