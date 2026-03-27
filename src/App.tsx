import { BrowserRouter as Router } from 'react-router-dom';

import AppRoutes from './router/AppRoutes';
import Navbar from './components/Navbar';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <main style={{ padding: "20px" }}>
        <AppRoutes />
      </main>
    </Router>
    </AuthProvider>
  );
}
export default App;
