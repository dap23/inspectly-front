import { Card } from '../components/Card.tsx';
import { NavLink } from 'react-router';
import { useFetch } from '../hooks/use-fetch.ts';
import { ApiResponse } from '../types';
import { Pagination } from '../components/Pagination.tsx';
import { useEffect, useState } from 'react';
import { BiLoader } from 'react-icons/bi';

export default function List() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const {data, loading, error, fetchData} = useFetch<ApiResponse>(`/images?page=${page}&limit=${limit}`, {
    method: 'GET'
  });
  
  useEffect(() => {
    fetchData();
  }, [page, limit]);
  
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <BiLoader className="animate-spin"/>
        <span className="text-sm animate-pulse">Please wait...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-fit px-3 py-2 rounded bg-red-100">
        <span className="text-sm text-red-500">Error while fetching data.</span>
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
      {!data?.data.length ? (
        <span className="text-sm text-gray-500">
          No records
        </span>
      ) : (
        <>
          <div className="grid lg:grid-cols-4 gap-4">
            {data?.data.map(d => (
              <Card
                key={d.ID}
                data={d}
                refetch={fetchData}
              />
            ))}
          </div>
          {data?.pagination && (
            <Pagination
              limit={limit}
              data={data.pagination}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          )}
        </>
      )}
    </>
  );
}