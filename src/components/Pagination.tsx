import { Pagination as PaginationType } from '../types';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import * as React from 'react';

interface PaginationProps {
  data: PaginationType;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({data, limit, onPageChange, onLimitChange}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <PrevButton
        disabled={data.page === 1}
        onClick={() => onPageChange(data.page - 1)}
      />
      <span className="text-sm font-semibold text-gray-500">
        Page {data.page} of {data.totalPages}
      </span>
      <NextButton
        disabled={data.page >= data.totalPages}
        onClick={() => onPageChange(data.page + 1)}
      />
      <SelectLimit
        onChange={(e) => onLimitChange(Number(e.target.value))}
        value={limit}
      />
    </div>
  );
};

const SelectLimit = ({...props}: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const options: { label: string; value: number; }[] = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '15', value: 15},
    {label: '20', value: 20}
  ];
  
  return (
    <select {...props} className="w-fit h-fit border border-zinc-100 p-1 rounded">
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

const NextButton = ({...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className="w-fit h-fit p-1 disabled:bg-zinc-100 disabled:cursor-auto cursor-pointer rounded border border-zinc-100 hover:bg-zinc-100"
    >
      <BiChevronRight className="w-5 h-5"/>
    </button>
  );
};

const PrevButton = ({...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className="w-fit h-fit p-1 disabled:bg-zinc-100 disabled:cursor-auto cursor-pointer rounded border border-zinc-100 hover:bg-zinc-100"
    >
      <BiChevronLeft className="w-5 h-5"/>
    </button>
  );
};
