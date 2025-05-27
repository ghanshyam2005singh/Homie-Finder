'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditRoomPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isAvailable, setIsAvailable] = useState(false);
  const [capacity, setCapacity] = useState(1);
  const [currentEmpty, setCurrentEmpty] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
      if (data) {
        setRoom(data);
        setIsAvailable(data.is_available);
        setCapacity(data.capacity);
        setCurrentEmpty(data.current_empty);
      } else {
        console.error(error);
      }
      setLoading(false);
    };
    fetchRoom();
  }, [id]);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('rooms')
      .update({ is_available: isAvailable, capacity, current_empty: currentEmpty })
      .eq('id', id);

    if (!error) {
      alert('Room updated successfully!');
      router.push('/rooms');
    } else {
      console.error(error);
      alert('Update failed.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Room Availability</h1>
      <label className="block mb-4">
        <span className="text-gray-700">Is Available?</span>
        <select
          value={isAvailable ? 'true' : 'false'}
          onChange={(e) => setIsAvailable(e.target.value === 'true')}
          className="block w-full mt-1 border rounded px-3 py-2"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>

      <label className="block mb-4">
        <span className="text-gray-700">Total Capacity</span>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="block w-full mt-1 border rounded px-3 py-2"
        />
      </label>

      <label className="block mb-6">
        <span className="text-gray-700">Currently Empty</span>
        <input
          type="number"
          value={currentEmpty}
          onChange={(e) => setCurrentEmpty(Number(e.target.value))}
          className="block w-full mt-1 border rounded px-3 py-2"
        />
      </label>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Update Room
      </button>
    </div>
  );
}
