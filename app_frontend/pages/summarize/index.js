// pages/dashboard.js

import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
  });

  useEffect(() => {
    // Fetch data from the new API URL
    const fetchData = async () => {
      const response = await fetch('http://localhost:3344/api/summarize');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Summarize Data</h1>
      <ul>
        <li><strong>Total Users:</strong> {data.total_users}</li>
        <li><strong>Total Products:</strong> {data.total_products}</li>
        <li><strong>Total Orders:</strong> {data.total_orders}</li>
      </ul>
    </div>
  );
};

export default Dashboard;
