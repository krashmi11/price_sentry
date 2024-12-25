import React from 'react';
import { useEffect } from 'react';
import ShoppingImage from '../Images/tracker.jpg'
// import ShoppingImage from '../Images/order-tracking-delivery-vector-16148050.jpg'
import './CSS/HomePage.css'
import BasicExample from './Navbar';
function Home(){
    localStorage.setItem('isAuthenticated', 'false');
    useEffect(() => {
        // Disable scrolling
        document.body.style.overflow = 'hidden';
    
        // Clean up by resetting the overflow when component unmounts
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, []);
    return(
        <div>
            <BasicExample/>
            <main class="main-class">
                <section className="image-container">
                <img src={ShoppingImage} alt="shoppingimgae" className='responsive-image'/>
                <div className="button-container">
                    <a className="track-button" href="/login">Track your product</a>
                </div> 
                               
                </section>
            </main>
        </div>
    );
}
export default Home;


