import { useState, useRef } from 'react';
import { BiPlus, BiUpload, BiX } from 'react-icons/bi';
import * as React from 'react';
import toast from 'react-hot-toast';

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  onUpload?: (files: File[]) => void;
}

interface ImageFile {
  file: File;
  status: 'Pending' | 'Uploading' | 'Uploaded';
}

export function FileUpload({name, onUpload, multiple = false, accept = 'image/*', ...props}: FileUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFilesAdded = (files: File[]) => {
    const imageFiles = files.map((file) => ({file, status: 'Pending'})) as ImageFile[];
    setImages((prev) => multiple ? [...prev, ...imageFiles] : imageFiles);
    if (onUpload) onUpload(files);
  };
  
  const handleUpload = () => {
    if (images.length === 0) return;
    setIsUploading(true);
    toast.loading('Uploading images...');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setOverallProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        toast.dismiss();
        toast.success('Upload successfully');
        setImages((prev) => prev.map((img) => ({...img, status: 'Uploaded'})));
      }
    }, 500);
  };
  
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };
  
  return (
    <div className="w-full h-fit p-3 rounded border border-zinc-100">
      <div className="flex items-center gap-4 mb-4">
        <label
          htmlFor={name}
          className="flex items-center cursor-pointer bg-sky-500 hover:bg-sky-500/90 transition text-white px-3 py-2 rounded text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <BiPlus className="w-5 h-5 mr-1"/>
          Choose
        </label>
        <button
          type="button"
          onClick={handleUpload}
          disabled={images.length === 0 || isUploading}
          className="flex items-center cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 bg-emerald-500 hover:bg-emerald-500/90 transition text-white px-3 py-2 rounded text-sm"
        >
          <BiUpload className="w-5 h-5 mr-1"/>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        <button
          type="button"
          onClick={() => setImages([])}
          className="flex items-center cursor-pointer bg-zinc-100 hover:bg-zinc-200/90 transition text-gray-600 px-3 py-2 rounded text-sm"
        >
          <BiX className="w-5 h-5 mr-1"/>
          Cancel
        </button>
      </div>
      
      <input
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFilesAdded(files);
          }
        }}
        className="hidden"
        {...props}
      />
      
      {!images.length && (
        <DragDropArea onFilesAdded={handleFilesAdded}/>
      )}
      
      {isUploading && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-4 mb-3">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{width: `${overallProgress}%`}}
          />
        </div>
      )}
      
      <ImageList images={images} removeImage={removeImage}/>
    </div>
  );
}

function DragDropArea({onFilesAdded}: { onFilesAdded: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      onFilesAdded(imageFiles);
    }
  };
  
  return (
    <div
      className={`w-full p-3 rounded border
        ${isDragging ? 'border-dashed border-blue-500 bg-blue-50' : 'border-zinc-100 bg-gray-50'}
        flex flex-col items-center justify-center cursor-pointer`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <p className="text-gray-500 text-sm">
        {isDragging ? 'Drop the images here...' : 'Drag and drop images here to upload.'}
      </p>
    </div>
  );
}

function ImageList({images, removeImage}: { images: ImageFile[]; removeImage: (index: number) => void }) {
  return (
    <ul className="flex flex-col gap-2 mt-3">
      {images.map((image, idx) => (
        <li
          key={idx}
          className="flex items-center gap-3 p-2 border border-gray-200 rounded-md"
        >
          <img
            src={URL.createObjectURL(image.file)}
            alt={image.file.name}
            className="w-16 h-12 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 truncate">
              {image.file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(image.file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <span
            className={`${
              image.status === 'Uploaded' ? 'bg-emerald-500' : 'bg-orange-500'
            } text-white text-xs px-2 py-1 rounded`}
          >
            {image.status}
          </span>
          <button
            type="button"
            className="text-red-500 cursor-pointer hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center transition duration-300"
            onClick={() => removeImage(idx)}
          >
            <BiX className="w-5 h-5"/>
          </button>
        </li>
      ))}
    </ul>
  );
}
