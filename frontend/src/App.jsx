import { useState } from 'react'
import {Routes,Route,BrowserRouter} from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';

import 'antd/dist/reset.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <BrowserRouter>
      <Routes>
         
               <Route path='/' element={<Home/>} />
                <Route path='/register' element={<Register/>} />
                 <Route path='/login' element={<Login/>} />
            
         
    </Routes>
    </BrowserRouter>
    
   
    </>
  )
}

export default App
