// pages/login.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import config from '../../config';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Create FormData object from form values
    const formDataObj = new FormData();
    formDataObj.append('username', formData.username);
    formDataObj.append('password', formData.password);

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/login/`, {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        alert("Your username/password are incorrect!");
        return;
      }

      const data = await response.json();
      console.log("Login response:", data); // Debug output

      // Check for token in different possible formats
      const accessToken = data.access || data.access_token || data.token || data.accessToken;
      const refreshToken = data.refresh || data.refresh_token || data.refreshToken;
      
      if (!accessToken) {
        console.error("Token format not recognized:", data);
        alert("Access token not found in response. Check console for details.");
        return;
      }
      
      // Store tokens in localStorage
      localStorage.setItem('jwt_access', accessToken);
      
      // Only store refresh token if it exists
      if (refreshToken) {
        localStorage.setItem('jwt_refresh', refreshToken);
      }

      alert("Login success!");
      window.location.href = "/home"; // redirect to profile
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    }
  };

  return (
    <>
      <Head>
        <title>ECOREACH - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="relative min-h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: "url('https://media-hosting.imagekit.io/892d3e30cf044eba/Background%20(3).png?Expires=1840896140&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=zIm-znBxc1OWVoeZFk8OHfPyPZkyl~~IkCHEMXcbF6jvYnDSpkqmy3INFg5GSW60VMg4z1OmWLVQOlzlOusQYwJWgpqCh1lCau7z0JCT0r0CsXdk2KUzIPK8THKh-BawqCio0u46nnK0Sj2xARooofwIGhibP2i18baVodsQrcanjyrh4aQc0mpdaYKwoGNes2dMrUnPU7PTFKEJ5sQnMifUpiWXaX0x3rDaFjBkMwEMUl0klT5T41mzyNI36S~7-Og0d9ZCzKercJVsfL~N34dEGJiVnAgXwvnjsJoDjAmDqDy9hKwn~vWw6uBDi-xXCfXlfxXr-MO25xkRqA9-Sg__')" }}>
        {/* Full-screen dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Centered content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Logo / Title */}
          <h1 className="text-6xl font-extrabold mb-8" style={{
            background: 'linear-gradient(to top, #D1DDD3, #85C099)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>ECOREACH</h1>
          
          {/* Login box */}
          <div className="bg-black bg-opacity-60 border border-black rounded-2xl p-8 w-full max-w-md text-white">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-6">Login</h2>
              
              <label className="block mb-2">ID:</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username}
                onChange={handleChange}
                placeholder="user_id" 
                className="w-full px-4 py-2 mb-4 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                required 
              />
              
              <label className="block mb-2">Password:</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="password" 
                className="w-full px-4 py-2 mb-6 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                required 
              />
              
              <button 
                type="submit" 
                className="w-full py-2 rounded-full bg-emerald-800 text-white font-semibold hover:bg-emerald-800 transition duration-200"
              >
                Login
              </button>
            </form>
            
            <p className="text-center mt-4 text-sm">
              Don&apos;t have an account yet?,{' '}
              <Link href="/register" className="underline text-emerald-600 hover:text-emerald-200">
                register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}