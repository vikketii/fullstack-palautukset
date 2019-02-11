import React from 'react'

const Filter = ({filterPersons, handleFilterChange}) =>
  <div>rajaa: <input value={filterPersons} onChange={handleFilterChange} /></div>  

const Persons = ({persons, filterPersons, removePerson}) => {
  const personsToShow = filterPersons
    ? persons.filter(person => person.name.toLowerCase().indexOf(filterPersons.toLowerCase()) > -1)
    : persons
  
  return (
    personsToShow.map(person => 
      <div key={person.name}>
        {person.name} {person.number}
        <button onClick={() => removePerson(person)}>poista</button>
      </div>
    )
  )
}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) =>
  <form onSubmit={addPerson}>
    <div>nimi: <input value={newName} onChange={handleNameChange} /></div>
    <div>numero: <input value={newNumber} onChange={handleNumberChange} /></div>
    <div><button type="submit">lisää</button></div>
  </form>


export default { Filter, Persons, PersonForm }