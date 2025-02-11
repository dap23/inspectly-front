import * as React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { BiX, BiCheck } from 'react-icons/bi';
import { ImageType } from '../types';
import { BASE_ASSET_URL } from '../utils/constant.ts';
import { useFetch } from '../hooks/use-fetch.ts';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface CardProps {
  data: ImageType;
  refetch?: () => Promise<void>;
}

export const Card: React.FC<CardProps> = ({data, refetch}) => {
  const {api, loading} = useFetch();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState<string>(data.title);
  
  async function handleUpdate() {
    if (!title) {
      toast.error('Title is required');
      return;
    }
    
    try {
      await api.put(`/images/${data.ID}`, {title});
      
      setEditMode(false);
      if (refetch) {
        await refetch();
      }
      toast.success('Title successfully updated!');
    } catch (err) {
      console.log(err);
      const errorMessage = (err as Error).message || 'Something went wrong!';
      toast.error(errorMessage);
    }
  }
  
  return (
    <div id="card" className="w-full h-fit p-3 rounded shadow-md border border-zinc-100">
      <figure className="w-full h-52 mb-4">
        <img src={`${BASE_ASSET_URL}${data.url}`} alt={data.title} className="w-full h-full object-cover rounded"/>
      </figure>
      <article className="flex items-center justify-between">
        {editMode ? (
          <div>
            <input
              placeholder="Input title here"
              className="border border-zinc-100 px-2 py-1.5 rounded text-xs placeholder:text-xs"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              disabled={loading}
            />
          </div>
        ) : (
          <h2 className="text-lg font-semibold">{data.title}</h2>
        )}
        {editMode ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setEditMode(false)}
              className="cursor-pointer p-2 rounded-full hover:bg-red-100"
            >
              <BiX className="text-red-500"/>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleUpdate}
              className="cursor-pointer p-2 rounded-full hover:bg-emerald-100"
            >
              <BiCheck className="text-emerald-500"/>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="cursor-pointer p-2 rounded-full hover:bg-blue-100"
            >
              <MdEdit className="text-blue-500"/>
            </button>
            <button
              className="cursor-pointer p-2 rounded-full hover:bg-red-100"
            >
              <MdDelete className="text-red-500"/>
            </button>
          </div>
        
        )}
      </article>
    </div>
  );
};