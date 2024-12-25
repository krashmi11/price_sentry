// components/BasicLineChart.js
import * as React from 'react';
import { useState } from 'react';
import { LineChart } from '@mui/x-charts';
import BasicExample from './Navbar';
import { MDBCard, MDBContainer } from 'mdb-react-ui-kit';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom'; // Import useLocation

import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);



const BasicLineChart = (props) => {

    const [selectedValue, setSelectedValue] = useState('protein_g');

    const [nutrition,setNutrition] = useState(null);

    const location = useLocation();
    const { trackRecords } = location.state || { trackRecords: [] }; // Access the trackRecords data

  const dates = trackRecords.map(record => record.currentDateTime); // Adjust according to the actual field name
  const prices = trackRecords.map(record => record.price); // Adjust according to the actual field name
  
    React.useEffect(()=>{
        setNutrition(props.data);
    },[]);

  const labels = nutrition.map(item => item.date);
  const chartData = {
    labels: labels,
    datasets: [
        {
            label: `Selected Value: ${selectedValue}`,
            data: nutrition.map(item => item[selectedValue]), // Dynamic data based on selection
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        },
    ],
};


const options = {
responsive: true,
plugins: {
    legend: {
        position: 'top',
        labels: {
            color: 'white', // Set legend text color to white
        },
    },
    title: {
        display: true,
        text: `Nutritional Data Chart (${selectedValue})`,
        color: 'white', // Set title color to white
    },
    tooltip: {
        bodyColor: 'white', // Set tooltip body text color to white
        titleColor: 'white', // Set tooltip title text color to white
    }
},
scales: {
    x: {
        ticks: {
            color: 'white', // Set x-axis labels text color to white
        },
    },
    y: {
        ticks: {
            color: 'white', // Set y-axis labels text color to white
        },
    },
},
};
  return (
    <div>
      <BasicExample />
      <div className="main-content">
        <Sidebar />
        <MDBContainer fluid>
          <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ fontSize: '1.5rem' }}>
              Price Analysis
            </p>
{/* 
            <LineChart
              xAxis={[{ data: dates }]}
              series={[
                {
                  data: prices,
                },
              ]}
              width={500}
              height={300}
            /> */}

            <div className='w-[100%] flex justify-center'>
            <div className='py-5'>
                <label className='text-white font-semibold mr-2'>Select Nutritional Value:</label>
                <select
                    className='bg-slate-800 text-white p-2 rounded'
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                >
                    <option value="protein_g">Protein (g)</option>
                    <option value="sugar_g">Sugar (g)</option>
                    <option value="fat_total_g">Total Fats (g)</option>
                    <option value="carbohydrates_total_g">Carbohydrates (g)</option>
                    <option value="fiber_g">Fiber (g)</option>
                    <option value="sodium_mg">Sodium (mg)</option>
                    <option value="cholesterol_mg">Cholesterol (mg)</option>
                    <option value="calories">Calories</option>
                </select>
            </div>
                <div className='w-[70%]'>
                <Line data={chartData} options={options} />
                </div>
            </div>

          </MDBCard>
        </MDBContainer>
      </div>
    </div>
  );
}

export default BasicLineChart;


    
