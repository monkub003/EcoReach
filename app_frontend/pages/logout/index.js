import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '@/context/CartContext'

export default function Logout() {
  const router = useRouter();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart();
    localStorage.removeItem('jwt_access');

    router.push('/home');
  }, [router]);


  return null; // No UI
}
