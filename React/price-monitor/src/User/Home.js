import React from 'react';
import BasicExample from "./Navbar";
import Sidebar from "./Sidebar";
import dashboard_img from '../Images/dreamstime_m_105078392-1024x512.jpg';
import './CSS/Home.css';

function DashBoard() {
    return (
        <div className="dashboard">
            <BasicExample />
            <div className="main-content">
                <Sidebar />
                <div className="content">
                    <div className="image_container">
                        <img src={dashboard_img} alt="bg_image" className="responsive_image" />
                        <div className='button-cont'>
                            <a href="/users/productdata" type="button" className='track-b'>Enter Product Link</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
