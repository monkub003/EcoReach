import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '@/context/CartContext';
import Head from 'next/head';
import Link from 'next/link';

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, clearCart } = useContext(CartContext);
  const [shippingFee, setShippingFee] = useState(50); // Default shipping fee
  const [subtotal, setSubtotal] = useState(0);
  const [hasToken, setHasToken] = useState(false);

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
    const token = localStorage.getItem('jwt_access');
    setHasToken(!!token); // true if token exists, false otherwise
  }, []);

  // Calculate subtotal from cart
  useEffect(() => {
    const calculateSubtotal = () => {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setSubtotal(total);
    };
    calculateSubtotal();
  }, [cart]);

  // Update shipping fee when method changes
  const handleShippingChange = (e) => {
    const method = e.target.value;
    let fee = 50; // Default to standard
    
    if (method === 'fd') {
      fee = 80; // Fast delivery
    } else if (method === 'pd') {
      fee = 100; // Premium delivery
    }
    
    setShippingFee(fee);
  };

  // Calculate total (subtotal + shipping)
  const total = subtotal + shippingFee;

  // Redirect to login if token is missing
  useEffect(() => {
    const token = localStorage.getItem('jwt_access');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    province: '',
    district: '',
    sub_district: '',
    postal_code: '',
    note: '',
    payment_method: 'cod',
    shipping_method: 'sd'
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_access');

    const response = await fetch('http://127.0.0.1:3344/api/orders/checkout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({
        ...formData,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Order placed successfully!');
      clearCart();
      router.push('/home'); // Redirect after successful checkout
    } else {
      alert('Checkout failed: ' + (data.error || 'Please check your information'));
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Checkout - EcoReach</title>
      </Head>

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
                className="bg-green-800 mx-0.5 px-2 py-2 rounded"
                onClick={searchProducts}
              >
                <img
                    src="https://media-hosting.imagekit.io/fbe2831f5a7d4990/search%20(1).png?Expires=1840816395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TSgo6QLco5OF2khs7dnWmkxTHrFdekokkQYLtPl4Gqzi8zhOYfm2sTIENO2R5gF-nZMxbjugT6YXIhQ6ePiwsxccukP5yG20ZyCtQAq98c7-G5zOfmmSv8jCTc05cgQJfVAm5iAMT7V1mmb1P3M3-mhFGegSAzxHiDBBuTVHi7o1HOg01rTU1GHv2ZAdVAPsdA9kSrL33K3H2OmxBIvdVSPemqzfakxsoFFRkEXfNLHeB2~s7o2PhR2roJqnDaCmssqZ4Pm8SxviHDeVio1ck0DyUNw40XgWv-px72M-B3e74kyER2RuVpTD1OhJC2iKNCWte4rz8Ye~lRXMC-UDCQ__"
                    alt="Search"
                    className="w-5 h-5"
                />
              </button>
            <input className="w-full px-4 py-2 text-black" type="text" placeholder="Looking for any products..." />
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
          <a href="/" className="px-4 py-1 rounded text-sm bg-white text-green-900 border border-green-900">ALL</a>
          <a href="/category/eco-tableware/" className="px-4 py-1 rounded text-sm bg-white text-green-900 border border-green-900">Eco Tableware</a>
          <a href="/category/sustainable-bags/" className="px-4 py-1 rounded text-sm bg-white text-green-900 border border-green-900">Sustainable Bags</a>
        </div>
      </nav>

      {/* Checkout Form */}
      <section className="max-w-screen-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
        <form onSubmit={handleCheckout}>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 gap-6 px-6 py-6 border-b">
              {/* Information */}
              <div>
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 10-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm-.75 7a.75.75 0 110-1.5.75.75 0 010 1.5z" clip-rule="evenodd"/>
                  </svg>
                  <span className="text-lg text-red-600 font-medium">Information</span>
                </div>
                <div className="space-y-4">
                  <div className="flex space-x-4 text-gray-800">
                    <input 
                      type="text" 
                      name="first_name" 
                      onChange={handleChange}
                      placeholder="First Name" 
                      className="flex-1 border rounded px-4 py-2" 
                      required
                    />
                    <input 
                      type="text" 
                      name="last_name" 
                      onChange={handleChange}
                      placeholder="Last Name" 
                      className="flex-1 border rounded px-4 py-2" 
                      required
                    />
                  </div>
                  <input 
                    type="tel" 
                    name="phone_number" 
                    onChange={handleChange}
                    placeholder="Phone Number" 
                    className="w-full border rounded px-4 py-2" 
                    required
                  />
                  <input 
                    type="email" 
                    name="email" 
                    onChange={handleChange}
                    placeholder="Email" 
                    className="w-full border rounded px-4 py-2" 
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 10a5 5 0 1110 0c0 2.5-2.5 5-5 8-2.5-3-5-5.5-5-8zM10 12a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  <span className="text-lg text-red-600 font-medium">Address</span>
                </div>
                <div className="space-y-4 text-gray-800">
                  <input 
                    type="text" 
                    name="address" 
                    onChange={handleChange}
                    placeholder="Address" 
                    className="w-full border rounded px-4 py-2" 
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="province" 
                      onChange={handleChange}
                      placeholder="Province" 
                      className="border rounded px-4 py-2" 
                      required
                    />
                    <input 
                      type="text" 
                      name="district" 
                      onChange={handleChange}
                      placeholder="District" 
                      className="border rounded px-4 py-2" 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="sub_district" 
                      onChange={handleChange}
                      placeholder="Sub-district" 
                      className="border rounded px-4 py-2" 
                      required
                    />
                    <input 
                      type="text" 
                      name="postal_code" 
                      onChange={handleChange}
                      placeholder="Postal Code" 
                      className="border rounded px-4 py-2" 
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Payment */}
            <div className="px-6 py-4 flex items-center border-b text-gray-800">
              <span className="font-medium">Shipping option:</span>
              <select 
                name="shipping_method" 
                onChange={(e) => {
                  handleChange(e);
                  handleShippingChange(e);
                }}
                className="ml-4 border rounded px-4 py-2"
              >
                <option value="sd">Standard Delivery (50฿)</option>
                <option value="fd">Fast Delivery (80฿)</option>
                <option value="pd">Premium Delivery (100฿)</option>
              </select>
            </div>
            <div className="px-6 py-4 flex items-center text-gray-800">
              <span className="font-medium">Payment Method:</span>
              <select 
                name="payment_method" 
                onChange={handleChange}
                className="ml-4 border rounded px-4 py-2"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="credit_card">Credit Card</option>
                <option value="mobile_banking">Mobile Banking</option>
              </select>
            </div>
          </div>

          {/* Note & Summary */}
          <div className="mt-4 flex text-gray-800">
            <textarea 
              name="note" 
              onChange={handleChange}
              placeholder="Note (optional)" 
              className="w-2/3 border rounded px-4 py-2 h-28"
            ></textarea>
            <div className="w-1/3 ml-6 text-right">
              <p className="text-xl font-semibold">Shipping Fee: <span>{shippingFee.toFixed(2)}฿</span></p>
              <p className="mt-2 text-xl font-semibold text-red-600">
                Total: <span>{total.toFixed(2)}฿</span>
              </p>
              <button 
                type="submit" 
                className="mt-4 bg-green-900 text-white rounded-full text-lg px-6 py-2 w-48"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}