import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OrderInfo() {
  const router = useRouter();
  const { product_id } = router.query;
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch when product_id is available
    if (!product_id) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3344/api/order/byProductId/${product_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Extract orders from the 'data' property in the response
        if (responseData && Array.isArray(responseData.data)) {
          console.log("Order data:", responseData.data);
          setOrders(responseData.data);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!orders || orders.length === 0) return <div>No orders found for this product</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders for Product ID: {product_id}</h1>
      
      {orders.map(order => (
        <div key={order.id}>
          <h2>Order #{order.id}</h2>
          <ul>
            <li><strong>User:</strong> {order.user}</li>
            <li><strong>Product:</strong> {order.product}</li>
            <li><strong>Quantity:</strong> {order.quantity}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}