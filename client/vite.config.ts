import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5182', // Backend API URL
        changeOrigin: true,
        secure: false,
      },
      '/hubs': {
        target: 'http://localhost:5182', // SignalR hub URL
        ws: true, // Enable WebSocket proxy
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5182', // Backend API URL
//         changeOrigin: true,
//         secure: false,
//       },
//       '/hubs': {
//         target: 'http://localhost:5182', // SignalR hub URL
//         ws: true, // Enable WebSocket proxy
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// })