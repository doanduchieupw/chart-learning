import React, { useEffect, useState } from 'react';
import './App.css';

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
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const App = () => {
    const [label, setLabel] = useState([]);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sensor data',
            },
        },
    };

    useEffect(() => {
        let sensor;
        const fetchData = async () => {
            setLoading(true);
            sensor = await axios.get('http://localhost:4000/api/sensor/data');
           
            let timeLabel = sensor?.data.map(
                (time) => (time?.createdAt.split('T')[1].split('.')[0])
            );
            let dataToGraph = {
                timeLabel,
                datasets: [
                    {
                        label: 'accX',
                        data: sensor?.data.map((data) => {
                            return data?.accX;
                        }),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    {
                        label: 'accY',
                        data: sensor?.data.map((data) => {
                            return data?.accY;
                        }),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                ],
            };
            setLabel(timeLabel);
            setData(dataToGraph);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <div>Loading ... </div>
            ) : (
                
              <Line options={options} data={data} />

            )}
        </>
    );
};

export default App;
