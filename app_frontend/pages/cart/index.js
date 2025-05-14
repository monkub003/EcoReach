// pages/cart.js
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/router';



export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const router = useRouter();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
  return (
    <div className="bg-white min-h-screen"> {/* Ensures full height */}
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
          {['ALL', 'Eco Tableware', 'Sustainable Bags'].map((category) => (
            <a className="px-4 py-1 rounded text-sm bg-white text-green-900 border border-green-900">
              {category}
            </a>
          ))}
        </div>
      </nav>

      {/* Cart Section - Extend to fill remaining space */}
      <section className="max-w-screen-2xl mx-auto px-6 py-8 bg-white flex-grow">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">My Cart</h1>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700"></th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Quantity</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Price</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cart.map(item => (
                  <tr key={item.product_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {/* Product Image */}
                        <div className="flex-shrink-0 h-20 w-20">
                          <img 
                            src={item.img_url || '/placeholder-product.jpg'} 
                            alt={item.name}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        className="w-16 border px-2 py-1 text-gray-800"
                        onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {cart.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <button
              className="text-sm text-gray-500 underline"
              onClick={clearCart}
            >
              clear all
            </button>
            <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
            <Link href="/checkout" legacyBehavior>
              <a className="bg-green-900 text-white px-6 py-2 w-48 rounded-full text-lg text-center block">
                Make Payment
              </a>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
