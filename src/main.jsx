import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initSyncBridge } from './store/syncBridge.js'

// 初始化前后台数据桥接（barStore → adminStore）
initSyncBridge()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
