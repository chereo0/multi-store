import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProductReviews } from '../../api/services';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews'); // reviews first by default

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const [p, r] = await Promise.all([
          getProduct(productId),
          getProductReviews(productId)
        ]);
        if (p.success) setProduct(p.data);
        if (r.success) setReviews(r.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const handleAdd = () => {
    if (!product) return;
    // product page doesn't know storeId; for demo, assume storeId = 1 if not embedded
    const fallbackStoreId = 1;
    addToCart(product, product.storeId || fallbackStoreId, 1);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/home" className="text-indigo-600 hover:text-indigo-500">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/home" className="text-2xl font-bold text-gray-900">Multi-Seller</Link>
            <div className="flex gap-3">
              <Link to={`/store/${product.storeId || 1}`} className="text-indigo-600 hover:text-indigo-700">Back to Store</Link>
              <Link to="/cart" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Cart</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-96 object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount})</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-6">${product.price}</div>
            <div className="flex gap-3">
              <button onClick={handleAdd} disabled={!product.inStock} className={`px-5 py-3 rounded-md text-white ${product.inStock ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <Link to={`/store/${product.storeId || 1}`} className="px-5 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">View Store</Link>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('reviews')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Reviews ({reviews.length})
              </button>
              <button onClick={() => setActiveTab('description')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Description
              </button>
            </nav>
          </div>

          {activeTab === 'reviews' && (
            <div className="py-6 space-y-6">
              {reviews.length === 0 && (
                <div className="text-gray-600">No reviews yet.</div>
              )}
              {reviews.map(r => (
                <div key={r.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-start">
                    <img src={r.userAvatar} alt={r.userName} className="w-10 h-10 rounded-full mr-4" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{r.userName}</h4>
                        <span className="text-xs text-gray-500">{r.date}</span>
                      </div>
                      <div className="flex items-center my-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700">{r.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'description' && (
            <div className="py-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About this product</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
