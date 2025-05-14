// pages/index.js
import Head from 'next/head'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{backgroundImage: `url('https://media-hosting.imagekit.io/892d3e30cf044eba/Background%20(3).png?Expires=1840896140&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=zIm-znBxc1OWVoeZFk8OHfPyPZkyl~~IkCHEMXcbF6jvYnDSpkqmy3INFg5GSW60VMg4z1OmWLVQOlzlOusQYwJWgpqCh1lCau7z0JCT0r0CsXdk2KUzIPK8THKh-BawqCio0u46nnK0Sj2xARooofwIGhibP2i18baVodsQrcanjyrh4aQc0mpdaYKwoGNes2dMrUnPU7PTFKEJ5sQnMifUpiWXaX0x3rDaFjBkMwEMUl0klT5T41mzyNI36S~7-Og0d9ZCzKercJVsfL~N34dEGJiVnAgXwvnjsJoDjAmDqDy9hKwn~vWw6uBDi-xXCfXlfxXr-MO25xkRqA9-Sg__')`}}>
      <Head>
        <title>Welcome - ECOREACH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 text-center w-fit h-fit space-y-6 animate-fade-in">
        <div className="relative mt-48 z-10 text-center w-fit h-fit space-y-6 animate-fade-in flex flex-col items-center">
          <h2 className="text-white text-lg">Welcome to our website</h2>
          <h1 className="text-8xl font-extrabold gradient-text">ECOREACH</h1>
          <p className="text-gray-200 text-base leading-relaxed">
            Accessible, sustainable choices for <br /> everyone. Join us in making a difference – <br />one eco-friendly product at a time.
          </p>
        </div>
      </div>
      <div className="relative z-10 gradient-border mt-56 animate-fade-in">
        <Link href="/login/" className="text-center inline-block bg-emerald-800 px-8 py-2 text-white rounded-full font-semibold w-56 transition-colors hover:bg-emerald-900">
          Get Started
        </Link>
      </div>
      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(to top, #D1DDD3, #85C099);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}