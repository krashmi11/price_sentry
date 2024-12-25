// services/productService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productDashboard';

const fetchProductDashboard = async (username) => {
    try {
        const response = await axios.post(API_URL, { username });
        return response.data;
    } catch (error) {
        console.error("Error fetching product dashboard:", error);
        throw error;
    }
};


export default fetchProductDashboard;

