import { useState, useEffect } from 'react'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import './App.css'

const App = () => {
  const locations = require('./city.list.min.json')
  const [cities, setCities] = useState([])
  const [city, setCity] = useState()
  const [weather, setWeather] = useState({})

  // console.log(locations)

  // country: "IR"
  // id: 833
  // name: "Ḩeşār-e Sefīd"
  // state: ""

  useEffect(() => {
    locations.map((l) => {
      l.description =
        l.name.toUpperCase() +
        (l.state ? ', ' + l.state : '') +
        ', ' +
        l.country

      // l.description = `${l.name.toUpperCase()}${
      //   l.state ? `, ${l.state}` : ''
      // }, ${l.country}`
    })
  }, [])

  useEffect(() => {
    if (city) {
      fetch(
        `http://api.openweathermap.org/data/2.5/weather?id=${city.id}&lang=zh_cn&units=metric&appid=dc4408560f0839350a00ed3420aa7445`
      )
        .then((response) => response.json())
        .then((result) => {
          setWeather({
            id: result.id,
            name: result.name,
            temperature: result.main.temp,
            description: result.weather[0].description,
            icon: result.weather[0].icon
          })
        })
        .catch((e) => console.log('Error: ', e))
    }
  }, [city])

  return (
    <>
      <Autocomplete
        freeSolo
        className='search'
        options={cities}
        onSelect={(e) => {
          const value = e.target.value.toUpperCase()
          if (value.length >= 3) {
            const possibleLocations = locations
              .filter((l) => l.description.includes(value))
              .slice(0, 10)
            setCities(possibleLocations.map((l) => l.description))

            const selected = locations.find((l) => l.description === value)
            setCity(selected)
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label='Search' variant='outlined' />
        )}
      />
      <div hidden={!weather.temperature}>
        <h2>
          {weather.id} {weather.name}
        </h2>
        <div
          className='temperature'
          style={{ color: weather.temperature >= 0 ? 'purple' : 'orangered' }}
        >
          {weather.temperature}
          <span>&#176;C</span>
        </div>
        <hr />
        <div className='description'>{weather.description}</div>
        <img
          alt='weather icon'
          src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        />
      </div>
    </>
  )
}

export default App
