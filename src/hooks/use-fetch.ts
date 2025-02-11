import { useState, useCallback } from 'react';
import { BASE_API } from '../utils/constant.ts';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FetchOptions {
  headers?: HeadersInit;
  skipAuth?: boolean;
}

export function useFetch<T>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null
  });
  
  const executeRequest = useCallback(async (
    url: string,
    method: string,
    options?: FetchOptions,
    body?: unknown
  ) => {
    setState(prev => ({...prev, loading: true, error: null}));
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      };
      
      const response = await fetch(`${BASE_API}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setState({data: result, loading: false, error: null});
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : new Error('An unknown error occurred');
      setState(prev => ({...prev, loading: false, error: errorMessage}));
      throw errorMessage;
    }
  }, []);
  
  const api = {
    get: useCallback((url: string, options?: FetchOptions) =>
      executeRequest(url, 'GET', options), [executeRequest]),
    
    put: useCallback((url: string, body: unknown, options?: FetchOptions) =>
      executeRequest(url, 'PUT', options, body), [executeRequest]),
    
    post: useCallback((url: string, body: unknown, options?: FetchOptions) =>
      executeRequest(url, 'POST', options, body), [executeRequest]),
    
    delete: useCallback((url: string, options?: FetchOptions) =>
      executeRequest(url, 'DELETE', options), [executeRequest])
  };
  
  return {...state, api};
}