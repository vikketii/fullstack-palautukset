import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterPersons, setFilterPersons] = useState('')
  const [statusMessage, setStatusMessage] = useState({message:null, status:null})
  
  useEffect(() => {
    personService
      .getAll().then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const sendStatusMessage = (message, status) => {
    setStatusMessage({message, status})
    setTimeout(() => {
      setStatusMessage({message:null, status:null})
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    const oldPerson = persons.find(person => person.name === newName)
    
    if (oldPerson) {
      if (window.confirm(`${oldPerson.name} on jo luettelossa, korvataanko vanha numero uudella?`)) {
        personService
          .update(oldPerson.id, personObject).then(returnedPerson => {
            setPersons(persons.map(person => person.id !== oldPerson.id ? person : returnedPerson))
            sendStatusMessage(`${returnedPerson.name} numero muutettiin`, 'good')
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          sendStatusMessage(`Lisättiin ${returnedPerson.name}`, 'good')
        })
        .catch(error => {
          sendStatusMessage(error.response.data.error, 'bad')
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const removePerson = person => {
    if (window.confirm(`Haluatko varmasti poistaa henkilön ${person.name} luettelosta?`)) {
      personService
        .remove(person).then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          sendStatusMessage(`Poistettiin ${person.name}`, 'good')
        })
        .catch(error => {
          sendStatusMessage(`Henkilö ${person.name} oli jo poistettu`, 'bad')
          personService.getAll()
            .then(persons => setPersons(persons))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterPersons(event.target.value)
  }

  return (
    <div>
      <h1>Puhelinluettelo</h1>
      <Notification statusMessage={statusMessage} />
      <Person.Filter filterPersons={filterPersons} handleFilterChange={handleFilterChange}/>
      <h2>Lisää uusi</h2>
      <Person.PersonForm addPerson={addPerson}
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h2>Numerot</h2>
      <Person.Persons persons={persons} filterPersons={filterPersons} removePerson={removePerson}/>
    </div>
  )
}

export default App