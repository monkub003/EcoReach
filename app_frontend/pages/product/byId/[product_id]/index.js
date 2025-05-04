import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProductInfo() {
    const router = useRouter();
    const { product_id } = router.query;
    
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        // Only fetch when product_id is available
        if (!product_id) {
            return;
        }
        
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3344/api/product/byId/${product_id}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                
                const responseData = await response.json();
                
                // Extract product from the 'data' property in the response
                if (responseData && responseData.data) {
                    console.log("Product data:", responseData.data);
                    setProduct(responseData.data);
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
    if (!product) return <div>No product found</div>;
    
    return (
        <div>
            <h1>{product.product_name}</h1>
            <div>
                <ul>
                    <li><strong>Product ID:</strong> {product.product_id}</li>
                    <li><strong>Name:</strong> {product.product_name}</li>
                    <li><strong>Price:</strong> ${product.price}</li>
                    <li><strong>Category:</strong> {product.category}</li>
                    
                    {Object.entries(product).map(([key, value]) => {
                        if (['product_id', 'product_name', 'price', 'category', 'id'].includes(key)) {
                            return null;
                        }
                        
                        return (
                            <li key={key}>
                                <strong>{key.replace(/_/g, ' ')}:</strong> {
                                    typeof value === 'object' 
                                        ? JSON.stringify(value) 
                                        : String(value)
                                }
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}