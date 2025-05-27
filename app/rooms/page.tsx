'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Room = {
  id: string;
  title: string;
  description: string;
  college: string;
  location: string;
  rent: number;
  images: string[];
  is_verified: boolean;
  is_available: boolean;
  capacity: number;
  current_empty: number;
};


type User = {
  id: string;
  phone: string;
  user_type: 'owner' | 'student';
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCollege, setFilterCollege] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    let query = supabase.from('rooms').select('*').order('created_at', { ascending: false });

    if (filterCollege) query = query.eq('college', filterCollege);
    if (filterLocation) query = query.eq('location', filterLocation);
    if (filterAvailable) {
  query = query.eq('is_available', true);
}


    const { data, error } = await query;

    if (error) {
      console.error('Error fetching rooms:', error.message);
    } else {
      setRooms(data || []);
    }

    setLoading(false);
  };

 useEffect(() => {
  fetchRooms();
}, [filterCollege, filterLocation, filterAvailable]);


  const handleViewDetails = (roomId: string) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      router.push(`/room/${roomId}`);
    }
  };

  const handleAddRoom = () => {
    if (user?.user_type === 'owner') {
      router.push('/add-room');
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white text-gray-800">
      <Navbar />

      <section className="max-w-7xl mx-auto w-full px-6 py-16 flex-1">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-700">Explore Available Rooms</h1>
          {user?.user_type === 'owner' && (
            <button
              onClick={handleAddRoom}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold transition"
            >
              + Add Room
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Filter by College"
            value={filterCollege}
            onChange={(e) => setFilterCollege(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full shadow-sm w-64"
          />
          <input
            type="text"
            placeholder="Filter by Location"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full shadow-sm w-64"
          />
          <label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={filterAvailable}
    onChange={(e) => setFilterAvailable(e.target.checked)}
  />
  Available Only
</label>

        </div>

        {/* Rooms */}
        {loading ? (
          <p className="text-center">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            😕 No rooms found. Be the first to{' '}
            <a href="/add-room" className="text-blue-600 font-semibold hover:underline">
              list one!
            </a>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
              >
                {room.images?.[0] && (
                  <Image
                    src={room.images[0]}
                    alt={room.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                )}
                <h2 className="text-xl font-bold text-gray-800">{room.title}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {room.college} • {room.location}
                </p>
                <p className="text-blue-600 font-semibold text-lg">₹{room.rent}/month</p>
                <p className="text-sm text-gray-600">
  {room.current_empty} spot(s) available out of {room.capacity}
</p>
<p className={`text-sm font-semibold ${room.is_available ? 'text-green-600' : 'text-red-500'}`}>
  {room.is_available ? 'Available' : 'Not Available'}
</p>

                <button
                  onClick={() => handleViewDetails(room.id)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition w-full"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Login Required</h3>
            <p className="text-gray-600 mb-4">Please login or signup to view full details.</p>
            <div className="flex justify-center gap-4">
              <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                Login
              </a>
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
