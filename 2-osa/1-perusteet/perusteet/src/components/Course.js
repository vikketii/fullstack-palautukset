import React from 'react'

const Header = ({header}) => <h1>{header}</h1>


const Part = ({part}) => <p>{part.name} {part.exercises}</p>


const Content = ({parts}) =>
  parts.map(part => <div key={part.id}><Part part={part} /></div>)

  
const Total = ({parts}) => {
  const total = parts.reduce((acc, current) => acc + current.exercises, 0)
  return <p>yhteensä {total} tehtävää</p>
}


const Course = ({course}) => {
  return (
    <div>
      <Header header={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course