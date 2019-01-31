import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Button = ({ handleClick, text }) => 
  <button onClick={handleClick}>{text}</button>

const Filter = ({filterCountries, handleFilterChange}) =>
  <div>find countries: <input value={filterCountries} onChange={handleFilterChange} /></div>
  
const Countries = ({countries, filterCountries, setFilterCountries}) => {
  const countriesToShow = filterCountries
    ? countries
      .filter(country => 
        country.name
          .toLowerCase()
          .indexOf(filterCountries.toLowerCase()) > -1)
    : countries
  
  if (countriesToShow.length > 10) {
    return `Too many matches, specify another filter`
  } else if (countriesToShow.length === 1) {
    return <Country country={countriesToShow[0]}/>
  }
  
  return (
    countriesToShow.map(country => 
      <div key={country.name}>
        {country.name}
        <Button handleClick={() => setFilterCountries(country.name)} text="show"/>
      </div>
    )
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt="" width="200"></img>
      <Weather capital={country.capital}/>
    </div>
  )  
}

const Weather = ({capital}) => {
  const [weather, setWeather] = useState(
    { 
      temp_c: 0,
      condition: {
        text: "",
        icon: ""
      }
    }
  )

  useEffect(() => {
    axios
      .get(`http://api.apixu.com/v1/current.json?key=<API-KEY-HERE>=${capital}`)
      .then(response => {
        setWeather(response.data.current)
      })
  }, [])
  
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>
        <strong>temperature: </strong>{weather.temp_c} Celsius
      </p>
      <img src={weather.condition.icon} alt={weather.condition.text} width="100"></img>
      <p>
        <strong>wind: </strong>{weather.wind_kph} kph direction {weather.wind_dir}
      </p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterCountries, setFilterCountries] = useState('')
  
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])  

  const handleFilterChange = (event) => {
    setFilterCountries(event.target.value)
  }

  return (
    <div>
      <Filter filterCountries={filterCountries} handleFilterChange={handleFilterChange}/>
      <Countries countries={countries} 
        filterCountries={filterCountries} 
        setFilterCountries={setFilterCountries}/>
    </div>
  )
}

export default App