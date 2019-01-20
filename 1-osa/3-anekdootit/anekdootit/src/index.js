import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ title }) => <h1>{title}</h1>

const Button = ({ handleClick, text }) => 
  <button onClick={handleClick}>{text}</button>

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const random = Math.floor(Math.random() * anecdotes.length)
  const mostVotes = points.indexOf(Math.max(...points))

  const addPoint = () => {
    const copy = points
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <Header title={'Anecdote of the day'} />
      {props.anecdotes[selected]}
      <br />
      has {points[selected]} votes
      <br />
      <Button handleClick={() => addPoint()} text="vote" />
      <Button handleClick={() => setSelected(random)} text="next anecdote" />
      <Header title={'Anecdote with most votes'} />
      
      {props.anecdotes[mostVotes]}
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)