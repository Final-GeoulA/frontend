import { BrowserRouter as Router } from 'react-router-dom';

import AppRoutes from './router/AppRoutes';
import Navbar from './components/Navbar';
import { AuthProvider } from './components/AuthProvider';
import { AdminAuthProvider } from './components/AdminAuthProvider';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Navbar />
          <main style={{ padding: "20px" }}>
            <AppRoutes />
          </main>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
export default App;
