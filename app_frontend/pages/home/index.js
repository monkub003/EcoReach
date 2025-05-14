import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';


export default function HomePage() {
  const bannerRef = useRef(null);
  const newReleaseRef = useRef(null);
  const trendingRef = useRef(null);
  const resultsRef = useRef(null);
  
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    fetchProducts();
    showDefault();
  }, [retryCount]);

  useEffect(() => {
    // Check for token on client side
    const token = localStorage.getItem('jwt_access');
    setHasToken(!!token); // true if token exists, false otherwise
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a timeout to the fetch request
      const fetchPromise = fetch('http://127.0.0.1:3344/api/product/all');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 5000)
      );
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.data) {
        throw new Error('Invalid data format received from API');
      }
      
      setProducts(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err);
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const showDefault = () => {
    bannerRef.current?.classList.remove('hidden');
    newReleaseRef.current?.classList.remove('hidden');
    trendingRef.current?.classList.remove('hidden');
    resultsRef.current?.classList.add('hidden');
    setActiveTab('all');
  };

  const filterProducts = (category) => {
    setActiveTab(category);
    if (category === 'all') {
      showDefault();
    } else {
      bannerRef.current?.classList.add('hidden');
      newReleaseRef.current?.classList.add('hidden');
      trendingRef.current?.classList.add('hidden');
      resultsRef.current?.classList.remove('hidden');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.trim().toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      showDefault();
      return;
    }
    
    setActiveTab('');
    bannerRef.current?.classList.add('hidden');
    newReleaseRef.current?.classList.add('hidden');
    trendingRef.current?.classList.add('hidden');
    resultsRef.current?.classList.remove('hidden');
  };

  const filteredProducts = searchTerm
    ? products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
    : activeTab !== 'all'
      ? products.filter(product => product.category === activeTab)
      : [];

  // Render error state with retry button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-red-600 text-xl font-semibold mb-2">Unable to load products</h2>
          <p className="text-gray-700 mb-4">{error.message || 'Failed to connect to API server'}</p>
          <div className="bg-gray-100 p-4 rounded text-left mb-4 text-sm">
            <p className="font-mono mb-2">Common issues:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Backend server not running at port 8000</li>
              <li>CORS policy blocking the request</li>
              <li>Network connectivity issues</li>
              <li>Incorrect API endpoint URL</li>
            </ul>
          </div>
          <button 
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white min-h-screen">
      <Head>
        <title>EcoReach Home</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <main className="bg-white">
        {/* Header */}
        <header className="bg-green-900 text-white py-4">
          <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between flex-wrap">
            <div className="text-2xl font-bold">
              <Link href="/home" legacyBehavior>
                <a className="text-2xl font-bold cursor-pointer">ECOREACH</a>
              </Link>
            </div>
            <div className="flex-1 mx-6 flex items-center bg-white rounded overflow-hidden">
              <button
                className="bg-green-800 px-2 py-2 mx-0.5 rounded"
              >
                <img
                    src="https://media-hosting.imagekit.io/fbe2831f5a7d4990/search%20(1).png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TSgo6QLco5OF2khs7dnWmkxTHrFdekokkQYLtPl4Gqzi8zhOYfm2sTIENO2R5gF-nZMxbjugT6YXIhQ6ePiwsxccukP5yG20ZyCtQAq98c7-G5zOfmmSv8jCTc05cgQJfVAm5iAMT7V1mmb1P3M3-mhFGegSAzxHiDBBuTVHi7o1HOg01rTU1GHv2ZAdVAPsdA9kSrL33K3H2OmxBIvdVSPemqzfakxsoFFRkEXfNLHeB2~s7o2PhR2roJqnDaCmssqZ4Pm8SxviHDeVio1ck0DyUNw40XgWv-px72M-B3e74kyER2RuVpTD1OhJC2iKNCWte4rz8Ye~lRXMC-UDCQ__"
                    alt="Search"
                    className="w-5 h-5"
                />
              </button>
              <input
                className="w-full px-4 py-2 text-black"
                type="text"
                placeholder="Looking for any products..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
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
            <button
              onClick={() => filterProducts('all')}
              className={`px-4 py-1 rounded text-sm ${
                activeTab === 'all'
                  ? 'bg-green-900 text-white'
                  : 'bg-white text-green-900 border border-green-900'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => filterProducts('Eco Tableware')}
              className={`px-4 py-1 rounded text-sm ${
                activeTab === 'Eco Tableware'
                  ? 'bg-green-900 text-white'
                  : 'bg-white text-green-900 border border-green-900'
              }`}
            >
              Eco Tableware
            </button>
            <button
              onClick={() => filterProducts('Sustainable Bags')}
              className={`px-4 py-1 rounded text-sm ${
                activeTab === 'Sustainable Bags'
                  ? 'bg-green-900 text-white'
                  : 'bg-white text-green-900 border border-green-900'
              }`}
            >
              Sustainable Bags
            </button>
          </div>
        </nav>
        
        {/* Results Grid (for filtering/search) */}
        <div
          ref={resultsRef}
          className="max-w-screen-2xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 hidden"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <a
                key={product.product_id}
                href={`/product/${product.product_id}`}
                className="product-card bg-white rounded-lg shadow w-40 flex-shrink-0 hover:shadow-lg transition"
                data-type={product.category}
              >
                <div className="bg-gray-100 w-full h-32 rounded mb-2 overflow-hidden relative">
                    <img
                    src={product.img_url}
                    alt={product.product_name}
                    className="object-cover"
                    />
                </div>
                <div className="text-sm font-semibold truncate mb-2 product-name p-2">
                  {product.product_name}
                </div>
                <div className="text-red-700 font-bold text-sm mb-4 px-2">
                  {product.price} ฿
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-10">No products found</div>
          )}
        </div>
        
        {/* Banner */}
        <div ref={bannerRef} className="max-w-screen-2xl mx-auto">
          <section className="m-6 p-0 bg-green-50 rounded-xl text-center">
                <img
                src="https://media-hosting.imagekit.io/cabe9209656a46ea/Banner.png?Expires=1840819647&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=YE8ntvC3wzUorMaIOmnQzMndRvjpd6OPtrSFs5nhMC17JJjS2nnEyjyhZ3LwLYrHW4U81v1jp2lt~RNeEXQjwLSUwpa4VBoAFUP~irSX4SH~MuWO2lp~SV1oOQBn-UL8Rrgw7MRGKs7gwWzLki5A-oopBXNdu3poo6zlBR6FIkVFNfJ6zW7rcehfRjM3aX7fB~PDKcQ91Sd32meygOdNIGlCSAfQD2~1UJlhCwGhZqsi4xik207zz6FR1bfGMgG6xAsb1680V1C-pgjFHug8-y3qJ52G8f1BIXIJP1pcO7q5--a4J5fwP9~MItjsOmht7wSKH57fj-pRXkrAiapfDw__"
                alt="Banner"
                className="w-full h-full object-contain"
                />
          </section>
        </div>
        
        {/* New Release */}
        <section ref={newReleaseRef} className="pt-2 pb-2 bg-green-50">
          <div className="max-w-screen-2xl mx-auto px-6">
            <h2 className="text-xl font-bold text-green-900 mb-2">New Release</h2>
            <div className="overflow-x-auto flex space-x-4 py-2">
              {products.filter(product => product.is_new_release === true).length > 0 ? (
                products.filter(product => product.is_new_release === true).map(product => (
                  <a
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
                  </a>
                ))
              ) : (
                <div className="w-full text-center py-4">No new releases available</div>
              )}
            </div>
          </div>
        </section>
        
        {/* Trending */}
        <section ref={trendingRef} className="max-w-screen-2xl mx-auto px-6 mt-8">
          <h2 className="text-xl font-bold text-green-900 mb-2">Trending Product</h2>
          <div className="overflow-x-auto flex space-x-4 py-2">
            {products.filter(product => product.is_trending === true).length > 0 ? (
              products.filter(product => product.is_trending === true).map(product => (
                <a
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
                </a>
              ))
            ) : (
              <div className="w-full text-center py-4">No trending products available</div>
            )}
          </div>
        </section>
      </main>
      </div>
    </>
  );
}