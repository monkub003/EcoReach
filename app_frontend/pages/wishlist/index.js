import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Wishlist() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [token, setToken] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchProducts = () => {
    // Show default products when search is empty
    showDefault();
  };

  const showDefault = () => {
    // Navigate to the products page without search query
    // This will show all products (default view)
    router.push('/home');
  };

  useEffect(() => {
    // Check for token on client side
    const jwtToken = localStorage.getItem('jwt_access');
    setHasToken(!!jwtToken); // true if token exists, false otherwise
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);


  // Redirect to login if token is missing
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt_access');
    if (!jwtToken) {
      router.push('/login');
    }
  }, [router]);

  // Fetch wishlist data from API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        
        // Get the token for authorization
        const jwtToken = localStorage.getItem('jwt_access');
        
        if (!jwtToken) {
          throw new Error('No authentication token found');
        }
        
        const response = await fetch('https://ecoreachdb-frontend.onrender.com/wishlist/', {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist data');
        }
        
        const data = await response.json();
        setWishlistItems(data.wishlist || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (hasToken) {
      fetchWishlist();
    }
  }, [hasToken]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <Head>
        <title>Wishlist - EcoReach</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
            <a className="px-4 py-1 rounded text-sm bg-white text-green-900 border border-green-900">
              {category}
            </a>
          ))}
        </div>
      </nav>

      {/* Checkout Form */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
        
        {/* Wishlist Section */}
        <div className="mt-8">
          
          {isLoading && <div className="text-gray-600">Loading wishlist...</div>}
          
          {error && <div className="text-red-500">Error: {error}</div>}
          
          {!isLoading && !error && wishlistItems.length === 0 && (
            <div className="text-gray-600">Your wishlist is empty.</div>
          )}
          
          {!isLoading && !error && wishlistItems.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {wishlistItems.map(product => (
                  <Link
                  key={product.product_id}
                  href={`/product/${product.product_id}`}
                  className="product-card bg-white rounded-lg shadow w-40 flex-shrink-0 hover:shadow-lg transition"
                  data-type={product.category}
                >
                  <div className="bg-gray-100 w-full h-32 rounded mb-2 overflow-hidden relative">
                    <img
                      src={product.img_url}
                      alt={product.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm font-semibold truncate mb-2 product-name p-2">
                    {product.product_name}
                  </div>
                  <div className="text-red-700 font-bold text-sm mb-4 px-2">
                    {product.price} ฿
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}