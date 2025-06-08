import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { routes } from '../router'
import GlobalState from './context'
import './index.css'


createRoot(document.getElementById('root')).render(
    <GlobalState>
    <RouterProvider router={routes}/>
    </GlobalState>
)
