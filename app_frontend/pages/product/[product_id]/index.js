// pages/product/[product_id].js
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { CartContext } from '@/context/CartContext';
import config from '../../../config';

export default function ProductInfo() {
  const router = useRouter();
  const { product_id } = router.query;
  
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  
  const [isAdded, setIsAdded] = useState(false);
  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500); // Reset after 1.5 seconds
  };

  useEffect(() => {
    // Check for token on client side
    const token = localStorage.getItem('jwt_access');
    setHasToken(!!token); // true if token exists, false otherwise
  }, []);

  useEffect(() => {
    // Only fetch when product_id is available
    if (!product_id) {
      return;
    }
    
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/product/byId/${product_id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Extract product from the 'data' property in the response
        if (responseData && responseData.data) {
          console.log("Product data:", responseData.data);
          setProduct(responseData.data);
          
          // Check if product is in wishlist
          checkWishlistStatus(responseData.data.id);
        } else {
          console.error("Invalid API response format:", responseData);
          throw new Error("Invalid API response format");
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [product_id]);
  
  // Check if product is already in wishlist
const checkWishlistStatus = async (productId) => {
  try {
    const token = localStorage.getItem('jwt_access');
    if (!token) {
      setIsFavorite(false);
      return;
    }
    
    // Fetch the user's wishlist from your API
    const response = await fetch(`${config.apiBaseUrl}/wishlist/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const wishlistData = await response.json();
      // Check if current product exists in wishlist
      const isInWishlist = wishlistData.some(item => item.id === productId);
      setIsFavorite(isInWishlist);
      
      // Also update local storage for quick reference
      let wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (isInWishlist && !wishlistItems.includes(productId)) {
        wishlistItems.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      } else if (!isInWishlist && wishlistItems.includes(productId)) {
        wishlistItems = wishlistItems.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      }
    }
  } catch (err) {
    console.error('Error checking wishlist status:', err);
    // Fallback to local storage check if API fails
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsFavorite(wishlistItems.includes(productId));
  }
};
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-${i}`} className="text-yellow-400">★</span>
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="text-yellow-400">★</span>
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  const toggleFavorite = async () => {
    if (!hasToken) {
      // Redirect to login if user is not logged in
      router.push('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('jwt_access');
      const url = isFavorite 
        ? `${config.apiBaseUrl}/wishlist/remove/${product_id}/`
        : `${config.apiBaseUrl}/wishlist/add/${product_id}/`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isFavorite ? 'remove from' : 'add to'} wishlist: ${response.status}`);
      }
      
      // Toggle favorite state after successful API call
      setIsFavorite(!isFavorite);
      
      // Update local storage for immediate UI feedback
      let wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (isFavorite) {
        wishlistItems = wishlistItems.filter(id => id !== product_id);
      } else {
        wishlistItems.push(product_id);
      }
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      
    } catch (err) {
      console.error('Error updating wishlist:', err);
      // Show error toast or notification here
    }
  };
  
  const searchProducts = () => {
    // Show default products when search is empty
    showDefault();
  };
  
  const showDefault = () => {
    // Navigate to the products page without search query
    // This will show all products (default view)
    router.push('/home');
  };
  
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  if (!product) return <div className="flex justify-center items-center h-screen">No product found</div>;

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>{product.product_name} - EcoReach</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={product.description} />
      </Head>

      {/* Header */}
      <header className="bg-green-900 text-white py-4">
        <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between flex-wrap">
          <Link href="/home" legacyBehavior>
            <a className="text-2xl font-bold cursor-pointer">ECOREACH</a>
          </Link>
          <div className="flex-1 mx-6 flex items-center bg-white rounded overflow-hidden">
            <button 
              className="bg-green-800 mx-0.5 px-2 py-2 rounded"
              onClick={searchProducts}
            >
              <img
                  src="https://media-hosting.imagekit.io/fbe2831f5a7d4990/search%20(1).png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TSgo6QLco5OF2khs7dnWmkxTHrFdekokkQYLtPl4Gqzi8zhOYfm2sTIENO2R5gF-nZMxbjugT6YXIhQ6ePiwsxccukP5yG20ZyCtQAq98c7-G5zOfmmSv8jCTc05cgQJfVAm5iAMT7V1mmb1P3M3-mhFGegSAzxHiDBBuTVHi7o1HOg01rTU1GHv2ZAdVAPsdA9kSrL33K3H2OmxBIvdVSPemqzfakxsoFFRkEXfNLHeB2~s7o2PhR2roJqnDaCmssqZ4Pm8SxviHDeVio1ck0DyUNw40XgWv-px72M-B3e74kyER2RuVpTD1OhJC2iKNCWte4rz8Ye~lRXMC-UDCQ__"
                  alt="Search"
                  className="w-5 h-5"
              />
            </button>
            <input 
              id="searchInput"
              className="w-full px-4 py-2 text-black" 
              type="text"
              placeholder="Looking for any products..."
              onKeyDown={(e) => e.key === 'Enter' && searchProducts()}
            />
          </div>
          <div className="flex items-center space-x-4">
            {hasToken ? (
                <a
                  href="/logout"
                  className="px-4 py-2 bg-red-700 rounded text-white font-semibold hover:bg-white hover:text-red-700 transition"
                >
                  Logout
                </a>
              ) : (
                <a
                  href="/login"
                  className="px-4 py-2 border-2 border-white rounded text-white font-semibold hover:bg-white hover:text-green-900 transition"
                >
                  Login
                </a>
              )}
              <a href="/wishlist">
                <div className="w-6 h-6 relative">
                    <img
                    src="https://media-hosting.imagekit.io/8c4a373bdeed4446/heart%20(2).png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=pS3ccLMkKA33QJlVbVi245ZSX4H~qK1~BoM6WVrUqkoj716Rz8mENBD7UHh1x4tWAwt5Bm~x9mPO84IHTZQs6daY-ulVzS2xcl-RfaZPjencVpkzIZj8oVFv~Svxh7LORusRaPg3y02ZnIdQ0lv8AdB0YOIS9TXv0iIpMZf-2Q9s2-MFMWtii-9tc49EtebHQhyJeFizcq9RzO72aX9Rim2I95Ry6o6Fx7ot4ddyvxiW-kwi9eV6NZBYkuxjyDcapU5gPB2VLFFR~j8HzAOs~4GrJADD2gr5hiGJ3gHeZs8awXgGYJOnX-6Ks4HbUzFNSXw7tMLBeE0vslXPdidoXw__"
                    alt="Wishlist"
                    className="w-6 h-6"
                    />
                </div>
              </a>
              <a href="/cart">
                <div className="w-6 h-6 relative">
                    <img
                    src="https://media-hosting.imagekit.io/71ac4ccf691442eb/cart.png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=F9Cb2Xn4eFJiRMblii1McQnqX7~hFjFY7osf4F6wj-rt0yq98BQ3hP45Id1Ra1EZNp51ELhJ9BEtnCMqm6-6wj9pNHc8p3GpC9H1c7Gp081HuAQ8BO~FvYPUwhgcrvCMW3U2t6S2srgnpShcam4KJcpSW1kx7AItfL8XEqqY8LiLtJ5ZA1DJcUP1w3VV5qtANrVUcb7yUZbSPHspCA6Os6ceP4nPA2o3hcFG0wNnOH5Vsoc5-FPx9WO4iUt~B3NxsCvty7FsLTkmgLYRgDF3n97MMUObgvPGnS0NTBaZ~5K5U2~xnT~ezMD91WUFygk0WhPT~Luxg60eHBWkNJlHGA__"
                    alt="Cart"
                    className="w-6 h-6"
                    />
                </div>
              </a>
              <a href="/dashboard">
                <div className="w-6 h-6 relative">
                <img
                    src="https://media-hosting.imagekit.io/72ce193069b4493b/dashboards.png?Expires=1841211154&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=rdhMUt9bzaT4rNjL1G7vZd6ryC2eY7A8AssfBZ9pc8QXKTFEbC3WiZ7UnbvCRkS9aUYuUMuk-9Y2DcSWOhaCJnaJ3MC8K6oUh049B6i76i8gMHxy6g41PF6DNJNCRfWNO~wlJakXeL1NHxmZDb~dmWiLQK2w-r6BtZAT3eAOpFTs2a1WIWEg1kkRcWEWXbDXpSzP7hkJagoc9rwh98VBdYLJ0eoqe9g75b1xW2v06cebXbmad4VsVEMYjr1cYfN2ElNylZURxSUNKfOfskrlODm9bTAGJPXwFirAEPqwCPJMQ6bpTjZqCgxUC2Yf8gBHkuqf4k7rgoHv3JN-eTHaBw__"
                    alt="Dashboard"
                    className="w-6 h-6"
                    />
                </div>
              </a>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex justify-center space-x-2 py-1.5">
          {['ALL', 'Eco Tableware', 'Sustainable Bags'].map((category) => (
            <a key={category} className="px-4 py-1 rounded text-sm bg-white text-green-900 border border-green-900">
              {category}
            </a>
          ))}
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="bg-green-50">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 text-gray-600 text-sm">
          <Link href="/home" legacyBehavior>
            <a className="hover:underline">Home</a>
          </Link> &gt;
          <Link href='/home' legacyBehavior>
            <a className="hover:underline"> {product.type || product.category}</a>
          </Link> &gt;
          <span className="font-semibold text-gray-800"> {product.product_name}</span>
        </div>
      </div>

      {/* Product Section */}
      <section className="bg-green-50">
        <div className="max-w-screen-2xl mx-auto px-6 pb-8 flex flex-col md:flex-row items-start md:items-stretch">
          {/* Image */}
          <div className="relative w-full md:w-1/3 rounded-lg shadow overflow-hidden bg-white" style={{paddingBottom: '35%'}}>
            <img
              src={product.img_url || '/placeholder.jpg'} 
              alt={product.product_name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Details */}
          <div className="w-full md:w-1/2 px-16 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-lg font-semibold text-gray-800">{product.rating || 0}.00</span>
                {renderStars(product.rating || 0)}
                <span className="text-gray-600">| stocks: {product.stock || 0}</span>
              </div>
            </div>
            
            <p className="text-gray-700 mt-4">{product.description}</p>
            
            <div className="mt-4">
              <span className="text-gray-800 font-medium">Type: </span>
              <span className="text-gray-800 font-semibold">{product.category || 'N/A'}</span>
            </div>

            <div className="mt-4">
              <span className="text-gray-800 font-medium">Eco Points: </span>
              <span className="text-green-800 font-semibold">{product.eco_point || 0}</span>
            </div>

            <p className="text-red-700 text-2xl font-bold mt-2">
              {product.price ? Number(product.price).toFixed(2) : '0.00'} ฿
            </p>

            <div className="mt-6 flex space-x-4">
              {/* Styled AddToCart component that matches the original design */}
              <div className="flex-grow-0">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-green-900 text-white px-6 py-2 rounded-full text-lg min-w-[140px] transition duration-300 hover:bg-green-700"
                >
                  {isAdded ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
              <button 
                type="button" 
                onClick={toggleFavorite}
                className="border-4 border-green-900 rounded-full p-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`w-6 h-6 ${isFavorite ? 'fill-current text-red-500' : 'text-green-900'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Description */}
      <section className="max-w-screen-2xl mx-auto px-6 py-4">
        <p className="text-gray-600 leading-relaxed">{product.detail || 'No detailed description available.'}</p>
      </section>
    </div>
  );
}