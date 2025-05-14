// pages/register.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
    });
  
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => {
          router.push('/login');
        }, 2000); // Redirect after 2 seconds
        return () => clearTimeout(timer);
      }
    }, [isSuccess, router]);
  
    const handleChange = e => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async e => {
      e.preventDefault();
      setErrors(null);
      setMessage('');
      setIsSuccess(false);
  
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setMessage(data.message || 'Registration successful!');
          setIsSuccess(true);
          setFormData({
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            phone_number: '',
            password: '',
            confirm_password: '',
          });
        } else {
          setErrors(data);
        }
      } catch (err) {
        console.error('Error:', err);
        setMessage('Something went wrong.');
      }
    };

    const renderErrors = errors => {
        return Object.entries(errors).map(([key, value]) => {
          if (Array.isArray(value)) {
            return (
              <p key={key} className="text-red-500 text-sm">
                {key}: {value.join(', ')}
              </p>
            );
          } else if (typeof value === 'object') {
            return (
              <div key={key}>
                <p className="text-red-500 text-sm font-semibold">{key}:</p>
                <div className="pl-4">{renderErrors(value)}</div>
              </div>
            );
          } else {
            return (
              <p key={key} className="text-red-500 text-sm">
                {key}: {value}
              </p>
            );
          }
        });
      };
  
  return (
    <div className="relative min-h-screen w-full bg-cover bg-center"
      style={{backgroundImage: "url('https://media-hosting.imagekit.io/892d3e30cf044eba/Background%20(3).png?Expires=1840896140&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=zIm-znBxc1OWVoeZFk8OHfPyPZkyl~~IkCHEMXcbF6jvYnDSpkqmy3INFg5GSW60VMg4z1OmWLVQOlzlOusQYwJWgpqCh1lCau7z0JCT0r0CsXdk2KUzIPK8THKh-BawqCio0u46nnK0Sj2xARooofwIGhibP2i18baVodsQrcanjyrh4aQc0mpdaYKwoGNes2dMrUnPU7PTFKEJ5sQnMifUpiWXaX0x3rDaFjBkMwEMUl0klT5T41mzyNI36S~7-Og0d9ZCzKercJVsfL~N34dEGJiVnAgXwvnjsJoDjAmDqDy9hKwn~vWw6uBDi-xXCfXlfxXr-MO25xkRqA9-Sg__')"}}>
      <Head>
        <title>ECOREACH - Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Success Notification */}
        {isSuccess && (
          <div className="fixed top-4 right-4 z-50 p-4 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{message || 'Registration successful! Redirecting to login...'}</span>
            </div>
          </div>
        )}
        
        {/* Brand */}
        <h1 className="text-6xl font-extrabold mb-8" style={{
          background: "linear-gradient(to top, #D1DDD3, #85C099)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>ECOREACH</h1>
        
        {/* Register Box */}
        <div className="bg-black bg-opacity-60 border border-black rounded-2xl p-8 w-full max-w-xl text-white">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-6">Register</h2>
            
            {errors && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-30 border border-red-600 rounded text-white">
                {renderErrors(errors)}
              </div>
            )}
            
            {message && !isSuccess && (
              <div className="mb-4 p-3 bg-blue-500 bg-opacity-30 border border-blue-600 rounded text-white">
                {message}
              </div>
            )}
            
            {/* Rest of your form remains the same */}
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-x-4">
              <div className="mb-4">
                <label className="block mb-2">First Name:</label>
                <input 
                  type="text" 
                  name="first_name" 
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John" 
                  className="w-full px-4 py-2 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Last Name:</label>
                <input 
                  type="text" 
                  name="last_name" 
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe" 
                  className="w-full px-4 py-2 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required 
                />
              </div>
            </div>
            
            {/* Contact fields */}
            <div className="grid grid-cols-2 gap-x-4">
              <div className="mb-4">
                <label className="block mb-2">Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com" 
                  className="w-full px-4 py-2 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Phone Number:</label>
                <input 
                  type="tel" 
                  name="phone_number" 
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="(123) 456-7890" 
                  className="w-full px-4 py-2 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required 
                />
              </div>
            </div>
            
            {/* Username */}
            <div className="mb-4">
              <label className="block mb-2">ID:</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username}
                onChange={handleChange}
                placeholder="username" 
                className="w-full px-4 py-2 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required 
              />
            </div>
            
            {/* Password */}
            <div className="mb-6">
              <label className="block mb-2">Password:</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full px-4 py-2 mb-4 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required 
              />
              <label className="block mb-2">Confirm password:</label>
              <input 
                type="password" 
                name="confirm_password" 
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full px-4 py-2 bg-white bg-opacity-20 placeholder-gray-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required 
              />
            </div>
            
            {/* Submit */}
            <button 
              type="submit"
              className="w-full py-2 rounded-full bg-emerald-800 text-white font-semibold hover:bg-emerald-700 transition duration-200"
            >
              Register
            </button>
            
            <div className="mt-4 text-center">
              <p>
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-400 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}