import { Card } from '../components/Card.tsx';
import { NavLink } from 'react-router';
import { useFetch } from '../hooks/use-fetch.ts';
import { ImageType } from '../types';
import { useEffect } from 'react';

export default function List() {
  const {data, loading, api, error} = useFetch<ImageType[]>();
  
  async function fetchData() {
    try {
      await api.get('/images');
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg">Loading images...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg">
          {error.message || 'Error while fetching images. Please try again later.'}
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-full h-full flex items-center justify-end">
        <NavLink to="/new" end>
          <button
            className="bg-sky-500 hover:bg-sky-500/90 transition px-4 py-2.5 rounded text-xs font-semibold text-white cursor-pointer"
          >
            Add New
          </button>
        </NavLink>
      </div>
      <div className="p-10 grid lg:grid-cols-4 gap-4">
        {data?.map(image => (
          <Card
            key={image.ID}
            data={image}
            refetch={fetchData}
          />
        ))}
      </div>
    </>
  );
}