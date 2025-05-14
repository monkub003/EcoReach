import "@/styles/globals.css";
import { CartProvider } from '../context/CartContext';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
// import { CartProvider } from '../context/CartContext';
// import '../styles/globals.css';


// function MyApp({ Component, pageProps }) {
//   return (
//     <CartProvider>
//       <Component {...pageProps} />
//     </CartProvider>
//   );
// }

// export default MyApp;