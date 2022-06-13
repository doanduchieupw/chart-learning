import React, { useEffect, useState, useCallback } from 'react';
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
import * as dayjs from 'dayjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Sensor chart',
    },
  },
};




export default function App() {
  const [dataChart, setDataChart]=useState();
  const [loading, setLoading]=useState(false);

  const convertDataChart=(data)=>{
    const result ={
      labels: [],
      x: [],
      y: []
    };

    if(data.length>0){
      data.map(item=>{
        result.labels.push(item.createdAt);
        result.x.push(item.accX);
        result.y.push(item.accY);
      })
    }

    const dataConfig = {
      labels: result.labels,
       datasets: [
         {
           label: 'accX',
           data: result.x,
           borderColor: 'rgb(255, 99, 132)',
           backgroundColor: 'rgba(255, 99, 132, 0.5)',
         },
         {
           label: 'accY',
           data:result.y,
           borderColor: 'rgb(53, 162, 235)',
           backgroundColor: 'rgba(53, 162, 235, 0.5)',
         },
       ],
     };

    return dataConfig;
  }

  const getDataChart = useCallback(()=>{
    console.log('83')
    setLoading(true);
    axios
    .get('http://localhost:4000/api/sensor/data')
    .then((res) => {
        const data = res?.data;
        const x = convertDataChart(data);
        console.log('xxx', x);
        setDataChart(x);
    })
    .catch(err=> console.log(err))
    .finally(()=>setLoading(false) )
  },[])
 
  useEffect(()=>{
    console.log('effect')
    setInterval(()=>{getDataChart()}, 2000);
  },[])



  console.log('ddd', dataChart);

  return <>
  {dataChart && <Line options={options} data={dataChart} />}
   

  </> 
}