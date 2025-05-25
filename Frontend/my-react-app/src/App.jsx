import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddPriduct';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/Login' element={<Login/>} />
        <Route path='Register' element={<Register/>}/>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='AddProduct' element={<AddProduct/>}/>
      </Routes>
    </Router>
  )
}

export default App
