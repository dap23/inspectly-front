import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import List from "./pages/List.tsx";
import DefaultLayout from "./layouts/DefaultLayout.tsx";
import { Form } from "./pages/Form.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<List />} />
          <Route path=":id" element={<Form />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
