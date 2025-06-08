import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddPriduct';
import Profile from './components/Profile';
import EditProduct from './components/EditProduct';
import Cart from './components/Cart';
import FloatingCart from './components/FloatingCart';
import PrivateRoute from './PrivateRoute';

function AppContent() {
  const location = useLocation();

  const hiddenRoutes = ["/login", "/register"];
  const shouldShowCart = !hiddenRoutes.includes(location.pathname.toLowerCase());

  return (
    <>
      {shouldShowCart && <FloatingCart />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
          } 
          />
        <Route path='/addproduct' element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        } />
        <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path='/edit/:id' element={
          <PrivateRoute>
            <EditProduct />
          </PrivateRoute>
        } />
        <Route path="/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
