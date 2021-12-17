import React, { useEffect, useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './App.css'
import {  
        getTopMessagersByThreshold,
        getTopMessagersByPercent,
        getTopMessagersByTotalLikes,
        getTopMessagersByTotalMessages,
        getTopSentLikersArray,
      } 
  from './components/loadGroupMeData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'GroupMe Messaging Data',
    },
  },
};

function App() {

  const returnLabelsArray = (messagerArray) => {
    let namesArray = []
    for(let messager of messagerArray) {
      namesArray.push(messager.name)
    }
    return namesArray
  }
  
  const returnData = (messagerArray) => {
    if(messagerArray && messagerArray.length > 0) {
      let whichCategoryString = ""
      if(whichCategory === 0) {
        whichCategoryString = "topMessages"
      } else if (whichCategory === 1) {
        whichCategoryString = "percentOfMessagesThatMetThreshold"
      } else if (whichCategory === 2) {
        whichCategoryString = "totalLikes"
      } else if(whichCategory === 3) {
        whichCategoryString = "totalMessages"
      } else {
        whichCategoryString = "data"
      }
      
      const labels = returnLabelsArray(messagerArray)
      const data = messagerArray.map((messager) => messager[whichCategoryString])
    
      return {
        labels: labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: data,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
    } else {
      return {
        labels: [],
        datasets: []
      }
    }
  }

  const handleChange = (event) => {
    setThreshold(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setWhichCategory(event.target.value);
  }

  // eslint-disable-next-line
  const [ topMessagers, setTopMessagers ] = useState([])
  const [ topLikers, setTopLikers ] = useState([])
  const [ numberOfEntries ] = useState(20)
  // eslint-disable-next-line
  const [labels, setLabels] = useState({})
  const [whichCategory, setWhichCategory] = useState(0)
  const [threshold, setThreshold] = useState(20)
  const [data, setData] = useState({
    labels: [],
    datasets: []
  })

  useEffect(() => {
    const yeet = getTopSentLikersArray()
    setTopLikers(yeet)
  }, [])

  useEffect(() => {
    let yeet = null
    if(whichCategory === 0) {
      yeet = getTopMessagersByThreshold(numberOfEntries, threshold)
    } else if (whichCategory === 1) {
      yeet = getTopMessagersByPercent(numberOfEntries, threshold)
    } else if (whichCategory === 2) {
      yeet = getTopMessagersByTotalLikes(numberOfEntries, 0)
    } else if (whichCategory === 3) {
      yeet = getTopMessagersByTotalMessages(numberOfEntries, 0)
    } else if (whichCategory === 4) {
      yeet = [
        {
          name: "Mike Spencer",
          data: 1,
        },
        {
          name: "Everyone Else",
          data: 0
        }
      ]
    } else if (whichCategory === 5) {
      yeet = [
        {
          name: "Tyler Kirkpatrick",
          data: 3,
        },
        {
          name: "Mike Spencer",
          data: 3
        },
        {
          name: "Daniel Liñan",
          data: 2
        },
        {
          name: "Ryan Pool",
          data: 2
        },
        {
          name: "Tanner Mauro",
          data: 2
        },
        {
          name: "John Lazar",
          data: 2
        },
        {
          name: "Brandon Campbell",
          data: 2
        },
        {
          name: "Brandon Carlton",
          data: 1
        },
        {
          name: "Haywood Miller",
          data: 0
        },
      ]
    }
    setTopMessagers(yeet)
    setLabels(returnLabelsArray(yeet))
    setData(returnData(yeet))
  // eslint-disable-next-line
  }, [threshold, whichCategory])

  return (
    <div className="container">
      <div className="heading">

      <h3>Mays MBA Class of 2022 GroupMe Data</h3>

      <FormControl >
        <InputLabel id="demo-simple-select-category-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-category-label"
          id="demo-simple-select-category"
          value={whichCategory}
          label="Category"
          onChange={handleChangeCategory}
          
        >
          <MenuItem value={0}>Most Messages Meeting Liked Threshold</MenuItem>
          <MenuItem value={1}>Highest Percent of Messages Meeting Liked Threshold</MenuItem>
          <MenuItem value={2}>Total Likes From Messages</MenuItem>
          <MenuItem value={3}>Most Sent Messages</MenuItem>
          <MenuItem value={4}>Most Canadian Messages</MenuItem>
          <MenuItem value={5}>Most WarZone Dubs During Class</MenuItem>
        </Select>
        
      </FormControl>
      <br />
      <br />
      { whichCategory >= 2 ? null : ( 
      <FormControl >
      
            <InputLabel id="demo-simple-select-threshold-label">Likes Threshold</InputLabel>
            <Select
              labelId="demo-simple-select-threshold-label"
              id="demo-simple-select-threshold"
              value={threshold}
              label="Likes Threshold"
              onChange={handleChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>

      </FormControl>
      )}
      </div>
      <div className="chart">
        <Bar options={options} data={data} />
      </div>
      { topLikers.length <= 0 ? null : ( 
      <div>
        <h3>Top 10 Members Who Liked the Most Number of Messages</h3>
        <p>#1: {topLikers[0].name} : {topLikers[0].likesSent}</p>
        <p>#2: {topLikers[1].name} : {topLikers[1].likesSent}</p>
        <p>#3: {topLikers[2].name} : {topLikers[2].likesSent}</p>
        <p>#4: {topLikers[3].name} : {topLikers[3].likesSent}</p>
        <p>#5: {topLikers[4].name} : {topLikers[4].likesSent}</p>
        <p>#6: {topLikers[5].name} : {topLikers[5].likesSent}</p>
        <p>#7: {topLikers[6].name} : {topLikers[6].likesSent}</p>
        <p>#8: {topLikers[7].name} : {topLikers[7].likesSent}</p>
        <p>#9: {topLikers[8].name} : {topLikers[8].likesSent}</p>
        <p>#10: {topLikers[9].name} : {topLikers[9].likesSent}</p>
      </div>
      )}
      { topLikers.length <= 0 ? null : ( 
      <div>
        <h3>Top 10 Members Who Liked the Least Number of Messages</h3>
        <p>#1: {topLikers[topLikers.length-1-0].name} : {topLikers[topLikers.length-1-0].likesSent}</p>
        <p>#2: {topLikers[topLikers.length-1-1].name} : {topLikers[topLikers.length-1-1].likesSent}</p>
        <p>#3: {topLikers[topLikers.length-1-2].name} : {topLikers[topLikers.length-1-2].likesSent}</p>
        <p>#4: {topLikers[topLikers.length-1-3].name} : {topLikers[topLikers.length-1-3].likesSent}</p>
        <p>#5: {topLikers[topLikers.length-1-4].name} : {topLikers[topLikers.length-1-4].likesSent}</p>
        <p>#6: {topLikers[topLikers.length-1-5].name} : {topLikers[topLikers.length-1-5].likesSent}</p>
        <p>#7: {topLikers[topLikers.length-1-6].name} : {topLikers[topLikers.length-1-6].likesSent}</p>
        <p>#8: {topLikers[topLikers.length-1-7].name} : {topLikers[topLikers.length-1-7].likesSent}</p>
        <p>#9: {topLikers[topLikers.length-1-8].name} : {topLikers[topLikers.length-1-8].likesSent}</p>
        <p>#10: {topLikers[topLikers.length-1-9].name} : {topLikers[topLikers.length-1-9].likesSent}</p>
      </div>
      )}

    </div>
  )
}

export default App