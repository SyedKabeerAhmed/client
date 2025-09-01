export const environment = {
  // API URL - Backend must have CORS configured for this domain
  api: 'https://3388ed975909.ngrok-free.app',
  
  // CORS Configuration Required on Backend:
  // The backend must allow requests from: https://client-bqkj.vercel.app
  // Add this to your backend:
  // app.use(cors({
  //   origin: ['https://client-bqkj.vercel.app', 'http://localhost:4200'],
  //   credentials: true
  // }));
};
  