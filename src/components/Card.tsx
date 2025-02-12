import * as React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { BiX, BiCheck } from 'react-icons/bi';
import { ImageType } from '../types';
import { BASE_ASSET_URL } from '../utils/constant.ts';
import { useFetch } from '../hooks/use-fetch.ts';
import toast from 'react-hot-toast';
import { useCallback, useState } from 'react';
import { UpdateTitleDto, UpdateTitleSchema } from '../dtos';

interface CardProps {
  data: ImageType;
  refetch?: () => Promise<void>;
}

export const Card: React.FC<CardProps> = ({data, refetch}) => {
  const {
    loading,
    fetchData: update,
    validationErrors,
    resetValidationError
  } = useFetch<any, UpdateTitleDto>(`/images/${data.ID}`, {
    method: 'PUT',
    schema: UpdateTitleSchema
  });
  const {fetchData: remove} = useFetch(`/images/${data.ID}`, {
    method: 'DELETE'
  });
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState<string>(data.title);
  
  const handleUpdate = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const res = await update({title});
      if (!res) return;
      setEditMode(false);
      if (refetch) await refetch();
      toast.success('Title successfully updated!');
    } catch (err) {
      toast.error((err as Error).message || 'Something went wrong!');
    }
  }, [title, update, refetch]);
  
  const handleDelete = useCallback(async () => {
    try {
      await remove();
      if (refetch) await refetch();
      toast.success('Record successfully deleted!');
    } catch (err) {
      toast.error((err as Error).message || 'Something went wrong!');
    }
  }, [remove, refetch]);
  
  return (
    <div id="card" className="w-full h-fit p-3 rounded shadow-md border border-zinc-100">
      <figure className="w-full h-52 mb-4">
        <img src={`${BASE_ASSET_URL}${data.url}`} alt={data.title} className="w-full h-full object-cover rounded"/>
      </figure>
      
      <div className="flex items-center justify-between">
        {editMode ? (
          <form onSubmit={handleUpdate} className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <input
                placeholder="Input title here"
                className={`border ${validationErrors ? 'border-rose-500' : 'border-zinc-100'} px-2 py-1.5 rounded text-xs placeholder:text-xs`}
                value={title}
                onInputCapture={resetValidationError}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
              {validationErrors?.title && (
                <small className="text-rose-500">{validationErrors.title}</small>
              )}
            </div>
            <div>
              <ActionButton
                type="button"
                onClick={() => setEditMode(false)}
                disabled={loading}
                icon={<BiX/>}
                color="red"
              />
              <ActionButton type="submit" disabled={loading} icon={<BiCheck/>} color="emerald"/>
            </div>
          </form>
        ) : (
          <h2 className="text-lg font-semibold">{data.title || 'Untitled'}</h2>
        )}
        
        <div className="flex items-center gap-2">
          {!editMode && (
            <>
              <ActionButton onClick={() => setEditMode(true)} icon={<MdEdit/>} color="blue"/>
              <ActionButton onClick={handleDelete} icon={<MdDelete/>} color="red"/>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({icon, color, ...props}: {
  icon: React.ReactNode; color: 'red' | 'blue' | 'emerald';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type={props.type}
    onClick={props.onClick}
    disabled={props.disabled}
    className={`cursor-pointer p-2 rounded-full hover:bg-${color}-100 disabled:opacity-50`}
  >
    <span className={`text-${color}-500`}>{icon}</span>
  </button>
);