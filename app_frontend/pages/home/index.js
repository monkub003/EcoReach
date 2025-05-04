import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const bannerRef = useRef(null);
  const newReleaseRef = useRef(null);
  const trendingRef = useRef(null);
  const resultsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock product data (replace with your actual data fetching)
  const mockProducts = {
    newRelease: [
      { id: 1, name: "Bamboo Cutlery Set", price: 249, type: "Eco Tableware", image: "/images/bamboo-cutlery.jpg" },
      { id: 2, name: "Cotton Tote Bag", price: 199, type: "Sustainable Bags", image: "/images/tote-bag.jpg" },
      { id: 3, name: "Bamboo Straw Pack", price: 149, type: "Eco Tableware", image: "/images/bamboo-straws.jpg" },
      { id: 1, name: "Bamboo Cutlery Set", price: 249, type: "Eco Tableware", image: "/images/bamboo-cutlery.jpg" },
      { id: 2, name: "Cotton Tote Bag", price: 199, type: "Sustainable Bags", image: "/images/tote-bag.jpg" },
      { id: 3, name: "Bamboo Straw Pack", price: 149, type: "Eco Tableware", image: "/images/bamboo-straws.jpg" },
      { id: 1, name: "Bamboo Cutlery Set", price: 249, type: "Eco Tableware", image: "/images/bamboo-cutlery.jpg" },
      { id: 2, name: "Cotton Tote Bag", price: 199, type: "Sustainable Bags", image: "/images/tote-bag.jpg" },
      { id: 3, name: "Bamboo Straw Pack", price: 149, type: "Eco Tableware", image: "/images/bamboo-straws.jpg" },
      { id: 1, name: "Bamboo Cutlery Set", price: 249, type: "Eco Tableware", image: "/images/bamboo-cutlery.jpg" },
      { id: 2, name: "Cotton Tote Bag", price: 199, type: "Sustainable Bags", image: "/images/tote-bag.jpg" },
      { id: 3, name: "Bamboo Straw Pack", price: 149, type: "Eco Tableware", image: "/images/bamboo-straws.jpg" },
    ],
    trending: [
      { id: 4, name: "Reusable Coffee Cup", price: 329, type: "Eco Tableware", image: "/images/coffee-cup.jpg" },
      { id: 5, name: "Canvas Backpack", price: 599, type: "Sustainable Bags", image: "/images/canvas-backpack.jpg" },
      { id: 6, name: "Biodegradable Bowls", price: 279, type: "Eco Tableware", image: "/images/eco-bowls.jpg" },
    ]
  };

  const allProducts = [...mockProducts.newRelease, ...mockProducts.trending];

  useEffect(() => {
    showDefault();
  }, []);

  const showDefault = () => {
    if (bannerRef.current) bannerRef.current.classList.remove('hidden');
    if (newReleaseRef.current) newReleaseRef.current.classList.remove('hidden');
    if (trendingRef.current) trendingRef.current.classList.remove('hidden');
    if (resultsRef.current) resultsRef.current.classList.add('hidden');
    setActiveTab('all');
  };

  const filterProducts = (type) => {
    setActiveTab(type);
    
    if (type === 'all') {
      showDefault();
    } else {
      if (bannerRef.current) bannerRef.current.classList.add('hidden');
      if (newReleaseRef.current) newReleaseRef.current.classList.add('hidden');
      if (trendingRef.current) trendingRef.current.classList.add('hidden');
      if (resultsRef.current) resultsRef.current.classList.remove('hidden');
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
    if (bannerRef.current) bannerRef.current.classList.add('hidden');
    if (newReleaseRef.current) newReleaseRef.current.classList.add('hidden');
    if (trendingRef.current) trendingRef.current.classList.add('hidden');
    if (resultsRef.current) resultsRef.current.classList.remove('hidden');
  };

  // Filter products based on search term or tab
  const filteredProducts = searchTerm 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : activeTab !== 'all' 
      ? allProducts.filter(product => product.type === activeTab)
      : [];

  return (
    <>
      <Head>
        <title>EcoReach Home</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <main className="bg-white">
        {/* Header */}
        <header className="bg-green-900 text-white py-4">
          <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between flex-wrap">
            <div className="text-2xl font-bold">ECOREACH</div>
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
              <a href="/profile">
                <div className="w-6 h-6 relative">
                    <img
                    src="https://media-hosting.imagekit.io/23847897bde942c5/Profile%20(1).png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=WBmyjYBCKYJWmGXiqzv33ogafmkadWRDQxMxtjrAnE7iwjkYQBFNGYy2YWkLEffTmnIYubgeUL6HVm-apTvTE6eOLB0YG-y1iIZl5lQllSXvmMUwCjB-Gpk1ANnHxp5O2-fwKgZD2gP6bFvKED2CRh1usmOisb7Uq4IBC6HYXTdTWbjcsluCZ7WlBfnBtAG~EYnhGMAZnTlVGv5G2f1OVxqRQDSckZioCpsUKJ9jKhJ0Lra9oW67bKc-VuZ1j6yrARR6WllGch3thlrOydrsBdWY1PLguFvYHBvwilAmV3nhOOG9uU8srCIprMMaeXkyxob7pzP015DetTr7BPwwlQ__"
                    alt="Profile"
                    className="w-6 h-6"
                    />
                </div>
              </a>
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
          {filteredProducts.map(product => (
            <a
              key={product.id}
              href={`/product-detail/${product.id}`}
              className="product-card bg-white rounded-lg shadow flex-shrink-0 hover:shadow-lg transition"
              data-type={product.type}
            >
              <div className="bg-gray-100 w-full h-32 rounded mb-2 overflow-hidden relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-sm font-semibold truncate mb-2 product-name p-2">
                {product.name}
              </div>
              <div className="text-red-700 font-bold text-sm mb-4 px-2">
                {product.price} ฿
              </div>
            </a>
          ))}
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
              {mockProducts.newRelease.map(product => (
                <a
                  key={product.id}
                  href={`/product-detail/${product.id}`}
                  className="product-card bg-white rounded-lg shadow w-40 flex-shrink-0 hover:shadow-lg transition"
                  data-type={product.type}
                >
                  <div className="bg-gray-100 w-full h-32 rounded mb-2 overflow-hidden relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm font-semibold truncate mb-2 product-name p-2">
                    {product.name}
                  </div>
                  <div className="text-red-700 font-bold text-sm mb-4 px-2">
                    {product.price} ฿
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        
        {/* Trending */}
        <section ref={trendingRef} className="max-w-screen-2xl mx-auto px-6 mt-8">
          <h2 className="text-xl font-bold text-green-900 mb-2">Trending Product</h2>
          <div className="overflow-x-auto flex space-x-4 py-2">
            {mockProducts.trending.map(product => (
              <a
                key={product.id}
                href={`/product-detail/${product.id}`}
                className="product-card bg-white rounded-lg shadow w-40 flex-shrink-0 hover:shadow-lg transition"
                data-type={product.type}
              >
                <div className="bg-gray-100 w-full h-32 rounded mb-2 overflow-hidden relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm font-semibold truncate mb-2 product-name p-2">
                  {product.name}
                </div>
                <div className="text-red-700 font-bold text-sm mb-4 px-2">
                  {product.price} ฿
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}