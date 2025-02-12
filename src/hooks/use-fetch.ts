import { useState, useEffect, useCallback } from 'react';
import { BASE_API } from '../utils/constant.ts';
import { ZodSchema } from 'zod';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchOptions<T> {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: T;
  schema?: ZodSchema<T>;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  validationErrors: Record<string, string> | null;
}

export const useFetch = <T, U = void>(
  url: string,
  options?: FetchOptions<U>
): FetchState<T> & { fetchData: (body?: U) => Promise<boolean>, resetValidationError: () => void } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  
  const resetValidationError = useCallback(() => setValidationErrors(null), []);
  
  const fetchData = useCallback(
    async (body?: U): Promise<boolean> => {
      setLoading(true);
      setError(null);
      setValidationErrors(null);
      
      try {
        if (body && options?.schema) {
          const parseResult = options.schema.safeParse(body);
          if (!parseResult.success) {
            const formattedErrors: Record<string, string> = {};
            parseResult.error.errors.forEach(err => {
              formattedErrors[err.path[0]] = err.message;
            });
            setValidationErrors(formattedErrors);
            setLoading(false);
            return false;
          }
        }
        
        const isFormData = body instanceof FormData;
        
        const response = await fetch(`${BASE_API}${url}`, {
          method: options?.method || 'GET',
          headers: isFormData ? {} : options?.headers || {'Content-Type': 'application/json'},
          body: body
            ? isFormData
              ? body // Directly pass FormData
              : JSON.stringify(body)
            : options?.body
              ? JSON.stringify(options.body)
              : null
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        return true;
      } catch (err) {
        setError(err as Error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );
  
  useEffect(() => {
    if (options?.method === 'GET') {
      fetchData();
    }
  }, []);
  
  return {data, loading, error, fetchData, validationErrors, resetValidationError};
};
