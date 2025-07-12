"use client";

import { useEffect } from "react";
import {Navbar} from "./Navbar";
import Head from "next/head";

export default function Hero() {
  useEffect(() => {
    const items = document.querySelectorAll(".carousel-item");
    let currentItem = 0;

    const rotateCarousel = () => {
      items.forEach((item) => ((item as HTMLElement).style.opacity = "0"));
      (items[currentItem] as HTMLElement).style.opacity = "1";
      currentItem = (currentItem + 1) % items.length;
    };

    const interval = setInterval(rotateCarousel, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800">
      <Head>
        <title>ReWear - Community Clothing Exchange</title>
        <meta name="description" content="Swap clothes, save the planet!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto p-6">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-green-700 mb-4">
            Welcome to ReWear
          </h2>
          <p className="text-lg mb-6">
            Join the movement for sustainable fashion. Swap your unused clothes
            and earn points!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
              Start Swapping
            </button>
            <button className="bg-white text-green-600 px-6 py-3 rounded-full border-2 border-green-600 hover:bg-green-100 transition">
              Browse Items
            </button>
            <button className="bg-white text-green-600 px-6 py-3 rounded-full border-2 border-green-600 hover:bg-green-100 transition">
              List an Item
            </button>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Featured Items
          </h3>
          <div className="relative overflow-hidden">
            <div className="flex transition-opacity duration-1000">
              <div className="carousel-item opacity-0 absolute w-full text-center">
                <div className="bg-gray-200 h-64 mx-auto w-3/4 rounded-lg"></div>
                <p className="mt-2">Stylish Jacket - 50 Points</p>
              </div>
              <div className="carousel-item opacity-0 absolute w-full text-center">
                <div className="bg-gray-200 h-64 mx-auto w-3/4 rounded-lg"></div>
                <p className="mt-2">Cozy Sweater - 30 Points</p>
              </div>
              <div className="carousel-item opacity-0 absolute w-full text-center">
                <div className="bg-gray-200 h-64 mx-auto w-3/4 rounded-lg"></div>
                <p className="mt-2">Trendy Jeans - 40 Points</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Tops", "Bottoms", "Dresses", "Accessories"].map((cat) => (
              <div
                key={cat}
                className="bg-gray-200 h-32 rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
              >
                <span className="text-lg font-medium">{cat}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}