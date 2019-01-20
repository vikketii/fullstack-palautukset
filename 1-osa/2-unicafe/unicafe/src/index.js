import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ title }) => <h1>{title}</h1>

const Button = ({ handleClick, text }) => 
  <button onClick={handleClick}>{text}</button>

const Statistic = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad }) => {
  const sum = good + neutral + bad
  const average = (good - bad) / sum
  const positive = good / sum + " %"

  if (sum === 0) {
    return (
      <div>
        Ei yhtään palautetta annettu
      </div>  
    )
  } 

  return (
    <table>
      <tbody>
        <Statistic text="hyvä" value={good} />
        <Statistic text="neutraali" value={neutral} />
        <Statistic text="huono" value={bad} />
        <Statistic text="yhteensä" value={sum} />
        <Statistic text="keskiarvo" value={average} />
        <Statistic text="positiivisia" value={positive} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header title={'anna palautetta'} />
      <Button handleClick={() => setGood(good + 1)} text="hyvä" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutraali" />
      <Button handleClick={() => setBad(bad + 1)} text="huono" />

      <Header title={'statistiikka'} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
