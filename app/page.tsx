import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      < Navbar />
      <section className="flex flex-1 flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Find Your Perfect Roommate</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-xl">
          A trusted platform where students post and find available rooms. Verified profiles, complete details, and a parent-friendly view.
        </p>
        <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition">
          Get Started
        </a>
      </section>
      < Footer />
    </main>
  );
}
