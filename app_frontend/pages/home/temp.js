import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useRef } from 'react';

export default function HomePage() {
    const bannerRef = useRef(null);
    const newReleaseRef = useRef(null);
    const trendingRef = useRef(null);
    const resultsRef = useRef(null);
  
    useEffect(() => {
      const tabs = document.querySelectorAll('.tab-link');
  
      function allCards() {
        return Array.from(document.querySelectorAll('#new-release-list .product-card, #trending-list .product-card'));
      }
  
      function showDefault() {
        bannerRef.current?.classList.remove('hidden');
        newReleaseRef.current?.classList.remove('hidden');
        trendingRef.current?.classList.remove('hidden');
        resultsRef.current?.classList.add('hidden');
        tabs.forEach(tab => {
          const type = tab.getAttribute('data-type');
          if (type === 'all') {
            tab.classList.add('bg-green-900', 'text-white');
            tab.classList.remove('bg-white', 'text-green-900', 'border', 'border-green-900');
          } else {
            tab.classList.add('bg-white', 'text-green-900', 'border', 'border-green-900');
            tab.classList.remove('bg-green-900', 'text-white');
          }
        });
      }
  
      function filterProducts(type, clickedTab) {
        tabs.forEach(tab => {
          if (tab === clickedTab) {
            tab.classList.remove('bg-white', 'text-green-900', 'border', 'border-green-900');
            tab.classList.add('bg-green-900', 'text-white');
          } else {
            tab.classList.remove('bg-green-900', 'text-white');
            tab.classList.add('bg-white', 'text-green-900', 'border', 'border-green-900');
          }
        });
  
        if (type === 'all') {
          showDefault();
        } else {
          bannerRef.current?.classList.add('hidden');
          newReleaseRef.current?.classList.add('hidden');
          trendingRef.current?.classList.add('hidden');
          resultsRef.current.innerHTML = '';
          resultsRef.current?.classList.remove('hidden');
  
          allCards()
            .filter(card => card.getAttribute('data-type') === type)
            .forEach(card => resultsRef.current?.appendChild(card.cloneNode(true)));
        }
      }
  
      function searchProducts() {
        const term = document.getElementById('searchInput')?.value.trim().toLowerCase();
        if (!term) {
          showDefault();
          return;
        }
  
        tabs.forEach(tab => {
          tab.classList.remove('bg-green-900', 'text-white');
          tab.classList.add('bg-white', 'text-green-900', 'border', 'border-green-900');
        });
  
        bannerRef.current?.classList.add('hidden');
        newReleaseRef.current?.classList.add('hidden');
        trendingRef.current?.classList.add('hidden');
        resultsRef.current.innerHTML = '';
        resultsRef.current?.classList.remove('hidden');
  
        allCards()
          .filter(card =>
            card.querySelector('.product-name')?.textContent.toLowerCase().includes(term)
          )
          .forEach(card => resultsRef.current?.appendChild(card.cloneNode(true)));
      }
  
      document.getElementById('searchInput')?.addEventListener('input', searchProducts);
  
      showDefault();
  
      return () => {
        document.getElementById('searchInput')?.removeEventListener('input', searchProducts);
      };
    }, []);
  
  return (
    <main class="bg-white">
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EcoReach Home</title>
    <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
    />
    {/* Header */}
    <header className="bg-green-900 text-white py-4">
        <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between flex-wrap">
        <div className="text-2xl font-bold">ECOREACH</div>
        <div className="flex-1 mx-6 flex items-center bg-white rounded overflow-hidden">
            <button
            id="searchBtn"
            className="bg-green-800 px-2 py-2 mx-0.5 rounded"
            onclick="searchProducts()"
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
            onkeydown="if(event.key==='Enter'){ searchProducts(); }"
            />
        </div>
        <div className="flex items-center space-x-4">
            <a href="/profile">
            <img
                src="https://media-hosting.imagekit.io/23847897bde942c5/Profile%20(1).png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=WBmyjYBCKYJWmGXiqzv33ogafmkadWRDQxMxtjrAnE7iwjkYQBFNGYy2YWkLEffTmnIYubgeUL6HVm-apTvTE6eOLB0YG-y1iIZl5lQllSXvmMUwCjB-Gpk1ANnHxp5O2-fwKgZD2gP6bFvKED2CRh1usmOisb7Uq4IBC6HYXTdTWbjcsluCZ7WlBfnBtAG~EYnhGMAZnTlVGv5G2f1OVxqRQDSckZioCpsUKJ9jKhJ0Lra9oW67bKc-VuZ1j6yrARR6WllGch3thlrOydrsBdWY1PLguFvYHBvwilAmV3nhOOG9uU8srCIprMMaeXkyxob7pzP015DetTr7BPwwlQ__"
                alt="Profile"
                className="w-6 h-6"
            />
            </a>
            <a href="/wishlist">
            <img
                src="https://media-hosting.imagekit.io/8c4a373bdeed4446/heart%20(2).png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=pS3ccLMkKA33QJlVbVi245ZSX4H~qK1~BoM6WVrUqkoj716Rz8mENBD7UHh1x4tWAwt5Bm~x9mPO84IHTZQs6daY-ulVzS2xcl-RfaZPjencVpkzIZj8oVFv~Svxh7LORusRaPg3y02ZnIdQ0lv8AdB0YOIS9TXv0iIpMZf-2Q9s2-MFMWtii-9tc49EtebHQhyJeFizcq9RzO72aX9Rim2I95Ry6o6Fx7ot4ddyvxiW-kwi9eV6NZBYkuxjyDcapU5gPB2VLFFR~j8HzAOs~4GrJADD2gr5hiGJ3gHeZs8awXgGYJOnX-6Ks4HbUzFNSXw7tMLBeE0vslXPdidoXw__"
                alt="Wishlist"
                className="w-6 h-6"
            />
            </a>
            <a href="/cart">
            <img
                src="https://media-hosting.imagekit.io/71ac4ccf691442eb/cart.png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=F9Cb2Xn4eFJiRMblii1McQnqX7~hFjFY7osf4F6wj-rt0yq98BQ3hP45Id1Ra1EZNp51ELhJ9BEtnCMqm6-6wj9pNHc8p3GpC9H1c7Gp081HuAQ8BO~FvYPUwhgcrvCMW3U2t6S2srgnpShcam4KJcpSW1kx7AItfL8XEqqY8LiLtJ5ZA1DJcUP1w3VV5qtANrVUcb7yUZbSPHspCA6Os6ceP4nPA2o3hcFG0wNnOH5Vsoc5-FPx9WO4iUt~B3NxsCvty7FsLTkmgLYRgDF3n97MMUObgvPGnS0NTBaZ~5K5U2~xnT~ezMD91WUFygk0WhPT~Luxg60eHBWkNJlHGA__"
                alt="Cart"
                className="w-6 h-6"
            />
            </a>
        </div>
        </div>
    </header>
    {/* Navigation Tabs */}
    <nav className="bg-white shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex justify-center space-x-2 py-1.5">
        <a
            href="#"
            data-type="all"
            className="tab-link px-4 py-1 rounded text-sm bg-green-900 text-white"
            onclick="filterProducts('all', this)"
        >
            ALL
        </a>
        <a
            href="#"
            data-type="Eco Tableware"
            className="tab-link px-4 py-1 rounded text-sm bg-white text-green-900 border border-green-900"
            onclick="filterProducts('Eco Tableware', this)"
        >
            Eco Tableware
        </a>
        <a
            href="#"
            data-type="Sustainable Bags"
            className="tab-link px-4 py-1 rounded text-sm bg-white text-green-900 border border-green-900"
            onclick="filterProducts('Sustainable Bags', this)"
        >
            Sustainable Bags
        </a>
        </div>
    </nav>
    {/* Results Grid (for filtering/search) */}
    <div
        id="resultsGrid"
        className="max-w-screen-2xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 hidden"
    />
    {/* Banner */}
    <div id="bannerSection" className="max-w-screen-2xl mx-auto">
        <section className="m-6 p-0 bg-green-50 rounded-xl text-center">
        <img
            src="https://media-hosting.imagekit.io/cabe9209656a46ea/Banner.png?Expires=1840819647&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=YE8ntvC3wzUorMaIOmnQzMndRvjpd6OPtrSFs5nhMC17JJjS2nnEyjyhZ3LwLYrHW4U81v1jp2lt~RNeEXQjwLSUwpa4VBoAFUP~irSX4SH~MuWO2lp~SV1oOQBn-UL8Rrgw7MRGKs7gwWzLki5A-oopBXNdu3poo6zlBR6FIkVFNfJ6zW7rcehfRjM3aX7fB~PDKcQ91Sd32meygOdNIGlCSAfQD2~1UJlhCwGhZqsi4xik207zz6FR1bfGMgG6xAsb1680V1C-pgjFHug8-y3qJ52G8f1BIXIJP1pcO7q5--a4J5fwP9~MItjsOmht7wSKH57fj-pRXkrAiapfDw__"
            alt="Banner"
            className="w-full h-full object-contain"
        />
        </section>
    </div>
    {/* New Release */}
    <section id="newReleaseSection" className="pt-2 pb-2 bg-green-50">
        <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-xl font-bold text-green-900 mb-2">New Release</h2>
        <div
            id="new-release-list"
            className="overflow-x-auto flex space-x-4 py-2"
        >
            {/* {% for product in new_release_products %} */}
            <a
            href="/product-detail/{{ product.id }}/"
            className="product-card bg-white rounded-lg shadow w-40 flex-shrink-0 hover:shadow-lg transition"
            data-type="{{ product.type }}"
            >
            <div className="bg-gray-100 w-full h-32 rounded mb-2 overflow-hidden">
                <img
                src="{{ product.image.url }}"
                alt="{{ product.name }}"
                className="w-full h-full object-cover"
                />
            </div>
            <div className="text-sm font-semibold truncate mb-2 product-name">
                {"{"}
                {"{"} product.name {"}"}
                {"}"}
            </div>
            <div className="text-red-700 font-bold text-sm mb-4">
                {"{"}
                {"{"} product.price {"}"}
                {"}"} ฿
            </div>
            </a>
            {/* {% endfor %} */}
        </div>
        </div>
    </section>
    {/* Trending */}
    <section id="trendingSection" className="max-w-screen-2xl mx-auto px-6 mt-8">
        <h2 className="text-xl font-bold text-green-900 mb-2">Trending Product</h2>
        <div id="trending-list" className="overflow-x-auto flex space-x-4 py-2">
        {/* {% for product in trending_products %} */}
        <a
            href="/product-detail/{{ product.id }}/"
            className="product-card bg-white rounded-lg shadow w-40 flex-shrink-0 hover:shadow-lg transition"
            data-type="{{ product.type }}"
        >
            <div className="bg-gray-100 w-full h-32 rounded mb-2 overflow-hidden">
            <img
                src="{{ product.image.url }}"
                alt="{{ product.name }}"
                className="w-full h-full object-cover"
            />
            </div>
            <div className="text-sm font-semibold truncate mb-2 product-name">
            {"{"}
            {"{"} product.name {"}"}
            {"}"}
            </div>
            <div className="text-red-700 font-bold text-sm mb-4">
            {"{"}
            {"{"} product.price {"}"}
            {"}"} ฿
            </div>
        </a>
        {/* {% endfor %} */}
        </div>
    </section>
    </main>
  );
}
