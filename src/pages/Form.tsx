import { NavLink } from 'react-router';
import { FileUpload } from '../components/FileUpload.tsx';

export function Form() {
  const handleUpload = (files: File[]) => {
    console.log(files);
  };
  
  return (
    <>
      <header className="flex items-center justify-between">
        <article className="w-full">
          <h2 className="text-2xl mb-1 font-semibold text-gray-600">Create Form</h2>
          <p className="text-sm text-gray-500">Description Form</p>
        </article>
        <div className="w-full h-full flex items-center justify-end">
          <NavLink to="/" end>
            <button
              className="bg-gray-200 hover:bg-gray-200/90 transition px-4 py-2.5 rounded text-xs font-semibold text-gray-600 cursor-pointer"
            >
              Cancel
            </button>
          </NavLink>
        </div>
      </header>
      <div className="w-full border border-zinc-100"/>
      <FileUpload
        name="images"
        accept="image/*"
        multiple
        onUpload={handleUpload}
      />
    </>
  );
}