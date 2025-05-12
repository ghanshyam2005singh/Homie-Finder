const Navbar = () => {
  return (
    <header className="bg-slate-50 shadow-md py-4 px-6 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
        {/* Brand Name */}
        <h1 className="text-2xl font-extrabold text-blue-600 whitespace-nowrap">Homie Finder</h1>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search location, college..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-4 whitespace-nowrap">
          <a href="#" className="text-sm text-blue-600 font-medium hover:underline">Login</a>
          <a href="#" className="text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">Sign Up</a>
          <a href="#" className="text-sm text-gray-600 hover:underline">Contact Us</a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
