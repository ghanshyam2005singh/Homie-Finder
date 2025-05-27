import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white text-gray-800">
      <Navbar />

      <section className="flex flex-col lg:flex-row items-center justify-between gap-10 flex-1 px-6 py-16 max-w-7xl mx-auto w-full">
        {/* Left Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight text-blue-700">
            Find Your <span className="text-blue-500">Perfect Room</span><br /> with Trust.
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            A secure and verified student platform to post and discover available rooms. Transparent profiles help parents trust your choice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition"
            >
              Get Started
            </a>
            <a
              href="./rooms"
              className="text-blue-600 border border-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-full transition"
            >
              Browse Listings
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <Image
            src="/roomate.svg" // Place a suitable SVG or image inside `public/`
            alt="Roommates illustration"
            width={500}
            height={500}
            className="w-full max-w-md mx-auto"
            priority
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
