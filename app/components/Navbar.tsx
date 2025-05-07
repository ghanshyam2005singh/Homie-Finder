export const Navbar = () => {
    return (
<header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Homie Finder</h1>
        <nav>
          <ul className="flex gap-6 text-gray-700 font-medium">
            <li><a href="#">Home</a></li>
            <li><a href="#">Browse Rooms</a></li>
            <li><a href="#">Login</a></li>
          </ul>
        </nav>
      </header>
    );
}

export default Navbar;