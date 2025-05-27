'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function AddRoomPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [college, setCollege] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState<number | ''>('');
  const [images, setImages] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
const [capacity, setCapacity] = useState<number | ''>('');
const [currentEmpty, setCurrentEmpty] = useState<number | ''>('');


  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(user);
    if (parsedUser.userType !== 'owner') {
      router.push('/');
      return;
    }
    setOwnerId(parsedUser.id);
  }, [router]);

  const handleSubmit = async () => {
    if (!title || !description || !college || !location || !rent || !images || !ownerId) {
      setError('Please fill in all fields and upload at least one image.');
      return;
    }

    setUploading(true);
    setError('');

    // Upload images to Supabase Storage
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(fileName, file);

      if (uploadError) {
        setError(`Failed to upload image: ${file.name}`);
        setUploading(false);
        return;
      }

      const url = supabase.storage
        .from('room-images')
        .getPublicUrl(fileName).data.publicUrl;

      uploadedUrls.push(url);
    }

    // Insert room into Supabase
    const { error: insertError } = await supabase.from('rooms').insert([
      {
        title,
        description,
        college,
        location,
        rent,
        images: uploadedUrls,
        owner_id: ownerId,
        is_verified: false,
      },
    ]);

    if (insertError) {
      setError('Failed to create room. Try again later.');
    } else {
      router.push('/dashboard');
    }

    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Navbar />

      <section className="max-w-3xl mx-auto w-full px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Add a New Room</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Room Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
          />
          <textarea
            placeholder="Room Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
            rows={4}
          />
          <input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
          />
          <input
            type="number"
            placeholder="Rent (₹/month)"
            value={rent}
            onChange={(e) => setRent(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-3"
          />
          <input
  type="number"
  placeholder="Total Capacity"
  value={capacity}
  onChange={(e) => setCapacity(Number(e.target.value))}
  className="w-full border border-gray-300 rounded-md p-3"
/>

<input
  type="number"
  placeholder="Currently Empty Slots"
  value={currentEmpty}
  onChange={(e) => setCurrentEmpty(Number(e.target.value))}
  className="w-full border border-gray-300 rounded-md p-3"
   />

<div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={isAvailable}
    onChange={(e) => setIsAvailable(e.target.checked)}
  />
  <label className="text-gray-700">Available</label>
</div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="w-full border border-gray-300 rounded-md p-3"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
          >
            {uploading ? 'Uploading...' : 'Submit Room'}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
