import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';

const List = lazy(() => import('./pages/List.tsx'));
const Form = lazy(() => import('./pages/Form.tsx'));
const DefaultLayout = lazy(() => import('./layouts/DefaultLayout.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout/>}>
          <Route index element={<List/>}/>
          <Route path=":id" element={<Form/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
