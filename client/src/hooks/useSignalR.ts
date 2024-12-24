// import { useEffect, useState } from 'react';
// import { HubConnection } from '@microsoft/signalr';
// import { createSignalRConnection } from '../services/signalRService';

// export function useSignalR() {
//   const [connection, setConnection] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const newConnection = createSignalRConnection();

//     newConnection.start()
//       .then(() => {
//         setConnection(newConnection);
//         setIsConnected(true);
//       })
//       .catch(console.error);

//     return () => {
//       newConnection.stop();
//     };
//   }, []);

//   return { connection, isConnected };
// }

// // Usage:
// function YourComponent() {
//   const { connection, isConnected } = useSignalR();

//   useEffect(() => {
//     if (!connection) return;

//     // Add event listeners here
//     connection.on('SomeEvent', (data) => {
//       // Handle event
//     });
//   }, [connection]);

//   return {isConnected ? 'Connected' : 'Connecting...'};
// }