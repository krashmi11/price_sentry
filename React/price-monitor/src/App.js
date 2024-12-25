import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/HomePage';
import Signup1 from './Home/Signup1';
// import Login from './Home/Login';
import Login1 from './Home/Login1';
import PrivateRoute from './PrivateRoute';
import DashBoard from './User/Home';
import ProductForm from './User/ProductForm';
import ProductDashBoard from './User/ProductDashboard';
import Reviewform from './User/Review_form';
import ReviewDashboard from './User/ReviewDashboard';
import PriceComparison from './User/PriceComparison';
function App() {
  const username=localStorage.getItem('username');
  console.log(username);
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/register" Component={Signup1} />
        <Route path="/login" Component={Login1}/>
        <Route path='/logout' Component={Login1}/>
        {/* <Route path="/user/index/0" element={<DashBoard/>}/> */}
        <Route path="/users/index/0" element={<PrivateRoute element={<DashBoard />} />} />
        <Route path='/users/productdata' element={<PrivateRoute element={<ProductForm/>}/>}/>
        <Route path='/users/productDashboard' element={<PrivateRoute element={<ProductDashBoard username={username}/>}/>}/>
        <Route path='/users/review-analysis' element={<PrivateRoute element={<Reviewform/>}/>}/>
        <Route path='/users/reviews-dashboard' element={<PrivateRoute element={<ReviewDashboard username={username}/>}/>}/>
        <Route path='/users/price-comparison' element={<PrivateRoute element={<PriceComparison/>}/>}/>

      </Routes>
    </Router>
    </>
  );
}

export default App;
