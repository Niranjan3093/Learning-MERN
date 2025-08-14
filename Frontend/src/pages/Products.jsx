import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PRODUCTS_API = 'http://localhost:5000/api/products';
const FAVORITES_API = 'http://localhost:5000/favorites/add';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [favMessage, setFavMessage] = useState(null);
  const productsPerPage = 10;

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(PRODUCTS_API);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setFavMessage('Failed to load products.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add to favorites
  const handleAddToFavorites = async (productId) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    let user;
    try {
      user = userData ? JSON.parse(userData) : null;
    } catch {
      user = null;
    }

    if (!token || !user?.id) {
      setFavMessage('Please log in to add to favorites.');
      return;
    }

    try {
      const res = await axios.post(
        FAVORITES_API,
        { userId: user.id, productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        setFavMessage(res.data.message || 'Added to favorites!');
      } else {
        setFavMessage('Could not add to favorites.');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      const msg = error?.response?.data?.message;

      switch (error?.response?.status) {
        case 400:
          setFavMessage(msg || 'Product already in favorites.');
          break;
        case 401:
          setFavMessage('Unauthorized. Please log in again.');
          break;
        case 404:
          setFavMessage('Product or user not found.');
          break;
        default:
          setFavMessage('Something went wrong.');
      }
    } finally {
      setTimeout(() => setFavMessage(null), 3000);
    }
  };

  // Add to cart
  const handleAddToCart = (product) => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      cart = [];
    }

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Loading Spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <div className="w-10 h-10 border-4 border-t-rose-400 border-neutral-300 rounded-full animate-spin mb-4" />
        <p className="text-neutral-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8 font-sans"
      style={{ backgroundColor: '#f0fef4', minHeight: '100vh' }}
    >
      <h1 className="text-center mb-6 text-3xl font-bold text-emerald-700">Our Fresh Fruits</h1>

      {favMessage && (
        <div className="bg-emerald-100 text-emerald-800 text-center py-2 px-4 rounded mb-4">
          {favMessage}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center p-6 bg-neutral-100 text-neutral-500 rounded">
          No products available at the moment.
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-neutral-200 text-center"
              >
                <div className="h-32 w-32 mx-auto overflow-hidden rounded-full border-4 border-emerald-200 mb-4">
                  <img
                    src={product.Thumbnail}
                    alt={product.ProductName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://via.placeholder.com/150x150?text=No+Image';
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">
                  {product.ProductName}
                </h3>
                <p className="text-sm text-neutral-500 mb-1">
                  Code: {product.ProductCode}
                </p>
                <p className="text-emerald-700 font-bold mb-1">
                  Rs. {product.Price}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {product.Stock > 0 ? `${product.Stock} in stock` : 'Out of stock'}
                </p>
                <p className="text-sm text-neutral-600 mb-3">
                  {product.Description?.length > 100
                    ? product.Description.substring(0, 100) + '...'
                    : product.Description}
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToFavorites(product._id)}
                    className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 px-3 py-1 rounded"
                  >
                    ❤ Add to Favorites
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-emerald-600 hover:text-white border border-emerald-600 hover:bg-emerald-600 px-3 py-1 rounded"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-emerald-600 hover:bg-emerald-100 disabled:text-neutral-400"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-emerald-600 hover:bg-emerald-100 disabled:text-neutral-400"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
