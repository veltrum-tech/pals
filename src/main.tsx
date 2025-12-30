import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NoInternetPage from './components/general/no_internet_comp.tsx'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/routes.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <NoInternetPage>
        <RouterProvider router={routes} />
      </NoInternetPage>
    </Provider>
  </React.StrictMode>
)
