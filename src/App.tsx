import { BrowserRouter as Router } from 'react-router-dom';

import AppRoutes from './router/AppRoutes';
import Layout from './components/Layout';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
    </AuthProvider>
  );
}
export default App;
