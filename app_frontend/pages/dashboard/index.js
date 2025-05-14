// pages/dashboard.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';



// Helper function to format numbers with commas
const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
};

export default function Dashboard() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check for token on client side
    const token = localStorage.getItem('jwt_access');
    setHasToken(!!token); // true if token exists, false otherwise
  }, []);
  
  // Real data from API
  const [dashboardData, setDashboardData] = useState({
    eco_points_total: 0,
    revenue_total: 0,
    users_count: 0,
    orders_count: 0,
    latest_orders: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch summary data
        const summaryResponse = await fetch('https://ecoreachdb-frontend.onrender.com/api/summarize');
        const summaryData = await summaryResponse.json();
        
        // Calculate total eco points and revenue (example, you may need to adjust)
        let totalEcoPoints = 0;
        let totalRevenue = 0;
        let latestOrdersData = [];
        
        // Fetch latest orders - starting from the most recent order (total_orders)
        // and going backward for 10 orders or until we reach order #1
        const numberOfOrdersToFetch = 10; // Change this to fetch more or fewer orders
        const startOrderId = summaryData.total_orders;
        
        for (let i = startOrderId; i > Math.max(startOrderId - numberOfOrdersToFetch, 0); i--) {
          try {
            const orderResponse = await fetch(`https://ecoreachdb-frontend.onrender.com/orders/products/${i}`);
            if (orderResponse.ok) {
              const orderData = await orderResponse.json();
              
              // Calculate eco points and subtotal from order data
              const orderEcoPoints = orderData.reduce((total, item) => {
                return total + (parseInt(item.product.eco_point) || 0);
              }, 0);
              
              const orderSubtotal = orderData.reduce((total, item) => {
                return total + parseFloat(item.subtotal);
              }, 0);
              
              // Calculate total quantity for this order
              const orderTotalQuantity = orderData.reduce((total, item) => {
                return total + parseInt(item.quantity || 0);
              }, 0);
              
              totalEcoPoints += orderEcoPoints;
              totalRevenue += orderSubtotal;
              
              // Format the date from the first item's created_at
              if (orderData.length > 0) {
                const createdAt = new Date(orderData[0].created_at);
                
                // Add 7 hours to the time for timezone adjustment
                const adjustedTime = new Date(createdAt);
                adjustedTime.setHours(adjustedTime.getHours());
                
                // Get the product name from the first item in the order
                // If there are multiple products, we can show the first product name followed by "and more..."
                let productName = "";
                if (orderData.length === 1) {
                  productName = orderData[0].product.product_name;
                } else {
                  productName = `${orderData[0].product.product_name} ${orderData.length > 1 ? `+ ${orderData.length - 1} more` : ''}`;
                }
                
                latestOrdersData.push({
                  orderId: i,
                  name: productName,
                  date: createdAt,
                  time: adjustedTime.toTimeString().slice(0, 5),
                  quantity: orderTotalQuantity
                });
              }
            }
          } catch (error) {
            console.error(`Error fetching order ${i}:`, error);
          }
        }
        
        // Orders are already sorted by ID (newest first) since we fetched them in descending order
        // But if needed, we can sort them explicitly by date too
        latestOrdersData.sort((a, b) => b.date - a.date);
        
        setDashboardData({
          eco_points_total: totalEcoPoints,
          revenue_total: totalRevenue,
          users_count: summaryData.total_users,
          orders_count: summaryData.total_orders,
          latest_orders: latestOrdersData
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Search functionality
  const [searchInput, setSearchInput] = useState("");
  const searchProducts = () => {
    // Show default products when search is empty
    showDefault();
  };
  
  const showDefault = () => {
    // Navigate to the products page without search query
    // This will show all products (default view)
    router.push('/home');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white min-h-screen text-gray-800">
      <Head>
        <title>Dashboard - EcoReach</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header (same as product page) */}
      <header className="bg-green-900 text-white py-4">
        <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between flex-wrap">
          <div className="text-2xl font-bold">
            <Link href="/home" legacyBehavior>
                <a className="text-2xl font-bold cursor-pointer">ECOREACH</a>
            </Link>
          </div>
          <div className="flex-1 mx-6 flex items-center bg-white rounded overflow-hidden">
            <button 
              id="searchBtn" 
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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

      {/* Dashboard Content */}
      <section className="max-w-screen-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Total Eco-Points */}
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col items-start">
            <div className="rounded-full mb-4 w-12 h-12 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#96D37F" }}>
              <img 
                src="https://media-hosting.imagekit.io/ed357543162b474d/leaves.png?Expires=1841727969&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=p6mGme9KT90uZnwshQM9pSjwwJmYF2CihbgtpodSRRdgaBsU0QTmPXzIZjnFO1jD1M9HbA0FcQeG1XYxkZohL3gvMavXwIq8F59pEP0E~-KzvD697rMnA6o2p9Jzi1SvwTzZ-gUASadgJ0bUArYuGbOwOTKQe4Nme5PZR16Rmm0VBhoFhFFVmaifTqP-UV4n1O2G18qxIj4kyx6jTlJYO9KEJLHW0gtFtbJhti0mlEbK3d1soec95ZOpe1~ZclvaOqUtOaUaok8DWF-F6UwBHLnXgaaTDzX9d1tChPGplsKZj2chg3c8DW8wMq8Y0E-zTPoWGTza4Vx9fTgzImxFoA__" 
                alt="Eco Points Icon" 
                className="w-6 h-6 object-contain" 
              />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Eco-Points</p>
            <p className="text-2xl font-bold text-black">{formatNumber(dashboardData.eco_points_total)}</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col items-start">
            <div className="rounded-full mb-4 w-12 h-12 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#F1AB7C" }}>
              <img 
                src="https://media-hosting.imagekit.io/d5163905e0b04663/coins.png?Expires=1841727969&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=UW~Vf4OBW6fydV8XSsgwoCj7d4C158kHRQOrztuXq6IL9oIpwk8nlbD~fv3XaGCTzpCtldiRst4jBTwDHXEfWCtvpzHkVN3pJS8enYWFu6aJ6IXPrp-vBPNtb-HtSOrIuHPPXjbtQVvJlLTte3xRUwXjSL3M9zIvU6kVySMEQDrPbod~iyJt22UsGq9SWb2dbniuzaNMa6hJj~pepoYJbEIUfkcCpnnxsFaFm1Fhw6k68dWgYupPmoQfqG1dfjRau7J19rxGl-rVbsfVQLURtZlqC9o6XqjtdfHFU8L0dndBygijTm-CnuaefVfTdEFAU4tZvUzzt4JCRkHZ1qcXyQ__" 
                alt="Revenue Icon" 
                className="w-6 h-6 object-contain" 
              />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-black">{formatNumber(dashboardData.revenue_total)}฿</p>
          </div>

          {/* Total Users */}
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col items-start">
            <div className="rounded-full mb-4 w-12 h-12 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#70A1E5" }}>
              <img 
                src="https://media-hosting.imagekit.io/98303a259ebc4cc6/user%20(2).png?Expires=1841727969&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yv5ECyE7iDG8Us82A9sdUwEUptueBOkqdWwJGlXTOHOTgB1k-Ekwtbjx5Ktqnjmp419iQv8z9K~86KCISErvjXKc4~Rs7Fw1qu33f6aGIlSOX0GfKqgcybf5yQfnaBgrOR60Ea1X7QbszCLm5Yuva0wBmMsJXRpjTo30Tc9i3OLJXAik1aZGwZ92XvJiLs664U1qhS8ftYQiw0RK3evbvYjt-M37dtQJArNsAZQ8Hows-lEPiHuo8h7j9Rx-n1Dnmz84RFfwB1Gc39WHTDHKdDS6Kk9lu7x0QGHo3Ota9hceJvQPjB3UbL1XuT5AjzUH-O1JpxXrr9oCJL8Dr1t~Dw__" 
                alt="Users Icon" 
                className="w-6 h-6 object-contain" 
              />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-black">{formatNumber(dashboardData.users_count)}</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col items-start">
            <div className="rounded-full mb-4 w-12 h-12 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#D398E7" }}>
              <img 
                src="https://media-hosting.imagekit.io/f427f357377b4815/shopping-bag.png?Expires=1841727969&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ovbZErP4e4QEs07yrQMb0-wuc~1jUjF87Piw~HN2jy0keJa2fV2sDqQDNd4e8tS-H8hZAqW0ruOwvxQB-4Xdt9Coz7shoAWTVU~NKdIe1SrjU8ERjTTW~-f-SUJb36xwOXEO4rv-dcCNlD~MRJhvirhyQQtQqJhFMxdjk2faqsgeJyHUvVhoWrMHmbidUrNFaOA8p-2l4Xea21fwrPWfXX4ouldtH2mEau3PEYTd6hL00NGLwm02LmDx46~PweFjh~J2D6APKhgspbughVMyxWHs4HhrGumfhio0h3ztCDAFWKNHdp3GkXG8vpEDA5y71TCP9fSNLwZy4Q1qKw7qqQ__" 
                alt="Orders Icon" 
                className="w-6 h-6 object-contain" 
              />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-black">{formatNumber(dashboardData.orders_count)}</p>
          </div>
        </div>

        {/* Description & Latest Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="text-gray-600 font-medium leading-relaxed">
            <p>Eco-Points represent how much love you’ve shown to the planet through your purchases on our website. Each product has a specific Eco-Point value assigned to it based on its sustainability impact. When you purchase an item, its individual Eco-Point value is added to your total—helping you track your positive contribution to the environment.</p>
          </div>

          <div className="lg:col-start-2 lg:col-span-3 bg-white border border-gray-200 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Latest Orders</h2>
            <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
              <table className="min-w-full border-collapse">
                <thead className="border-b border-gray-300 text-gray-800">
                  <tr>
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.latest_orders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 text-gray-800">
                      <td className="py-2">{order.name}</td>
                      <td className="py-2">{formatDate(order.date)}</td>
                      <td className="py-2">{order.time}</td>
                      <td className="py-2 pl-6">{order.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}