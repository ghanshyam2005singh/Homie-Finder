'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Image from 'next/image';

type Room = {
  id: string;
  title: string;
  description: string;
  college: string;
  location: string;
  rent: number;
  images: string[];
  owner_id: string;
};

type User = {
  id: string;
  name: string;
  phone: string;
  userType: string;
};

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [similarRooms, setSimilarRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchRoomDetails = async () => {
      setLoading(true);

      const { data: roomData, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !roomData) {
        router.push('/404');
        return;
      }

      setRoom(roomData);

      // Fetch owner info
      const { data: ownerData } = await supabase
        .from('users')
        .select('id, name, phone')
        .eq('id', roomData.owner_id)
        .single();

      setOwner(ownerData || null);

      // Fetch similar rooms
      const { data: similar } = await supabase
        .from('rooms')
        .select('*')
        .neq('id', id)
        .or(`college.eq.${roomData.college},location.eq.${roomData.location}`)
        .limit(3);

      setSimilarRooms(similar || []);
      setLoading(false);
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!room) {
    return <p className="text-center text-red-500 py-10">Room not found.</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-gray-800 flex flex-col">
      <Navbar />

      <section className="max-w-6xl mx-auto w-full p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            {room.images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Room ${index}`}
                width={600}
                height={400}
                className="rounded-xl object-cover w-full"
              />
            ))}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-blue-700">{room.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{room.description}</p>
            <p className="mt-4 text-xl font-semibold text-gray-800">
              ₹{room.rent}/month
            </p>
            <p className="text-gray-600 mt-2">
              {room.college} • {room.location}
            </p>

            {/* Contact */}
            {owner && (
              <div className="mt-6 p-4 border rounded-lg bg-blue-50 text-blue-800">
                <h3 className="text-lg font-semibold">Owner Contact</h3>
                <p>Name: {owner.name}</p>
                <p>Phone: {owner.phone}</p>
              </div>
            )}

            {/* Messaging / Booking */}
            <button
              onClick={() => alert('Booking request sent to owner.')}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
            >
              Send Booking Request
            </button>
          </div>
        </div>

        {/* Similar Rooms */}
        {similarRooms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Similar Rooms</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarRooms.map((room) => (
                <div key={room.id} className="bg-white p-4 rounded-lg shadow-md">
                  <Image
                    src={room.images?.[0]}
                    alt={room.title}
                    width={400}
                    height={250}
                    className="rounded-md object-cover w-full h-48"
                  />
                  <h3 className="mt-2 text-lg font-bold">{room.title}</h3>
                  <p className="text-gray-600">
                    {room.college} • {room.location}
                  </p>
                  <p className="text-blue-600 font-semibold mt-1">
                    ₹{room.rent}/month
                  </p>
                  <a
                    href={`/room/${room.id}`}
                    className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                  >
                    View Details →
                    {user?.id === room.owner_id && (
  <button
    onClick={() => router.push(`/edit-room/${room.id}`)}
    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
  >
    Edit Room
  </button>
)}

                  </a>
                </div>
                
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
