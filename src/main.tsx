import React from 'react'
import ReactDOM from 'react-dom/client'
import InfiniteScroll from './components/infinite-scroll/InfiniteScroll'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InfiniteScroll />
  </React.StrictMode>
)
