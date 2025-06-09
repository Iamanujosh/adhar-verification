import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import Login from './pages/loginPage.js';
import Signup from './pages/signupPage.js';
import Home from './pages/homePage';
import Verify from './pages/verifyPage';
import Header from './components/header';

function App() {
  return (
    <div className="bg-slate-200 px-0 font-serif">
       
      <Router>
        <Header />
        <div>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/verify" element={<Verify />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
        </div>
      </Router>

    </div>
  );
}

export default App;
