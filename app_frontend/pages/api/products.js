// pages/api/products.js (for Next.js)
// Create this file if you're using Next.js and want to proxy requests to your Django backend

export default async function handler(req, res) {
    const { limit } = req.query;
    
    try {
      // Replace with your actual Django API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/products/`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract products from the 'data' key and limit them if needed
      let products = data.data || [];
      if (limit) {
        products = products.slice(0, parseInt(limit));
      }
      
      // Return in the format expected by the frontend
      res.status(200).json(products);
    } catch (error) {
      console.error('Error in API products route:', error);
      res.status(500).json({ error: error.message });
    }
  }