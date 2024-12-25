import React from 'react';
import './CSS/Sidebar.css';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBSidebarFooter,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <span
      style={{ display: 'flex', minHeight: '100vh', overflow:'scroll initial' }}
    >
      <CDBSidebar textColor="black" backgroundColor="#ffd670">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: 'inherit' }}
          >
            Sidebar
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent  textColor="black" className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/users/productDashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem  icon="columns">Product Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/users/productdata" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table" >Track product</CDBSidebarMenuItem>
            </NavLink>
            <NavLink eexact to="/users/review-analysis" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Review Analysis</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/users/reviews-dashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">
                Reviews DashBoard
              </CDBSidebarMenuItem>
              
            </NavLink>
            <NavLink exact to="/users/price-comparison" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">
                Price Comparison
              </CDBSidebarMenuItem>
              
            </NavLink>

          
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
           <NavLink exact to="/logout" activeClassName="activeClicked">
           <CDBSidebarMenuItem icon="user" style={{ color: 'black' }}>Logout</CDBSidebarMenuItem>
            </NavLink>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </span>
  );
};

export default Sidebar;