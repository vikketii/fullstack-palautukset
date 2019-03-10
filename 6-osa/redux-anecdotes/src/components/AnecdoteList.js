import React from 'react'
import { connect } from 'react-redux'
import Anecdote from './Anecdote'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    props.voteAnecdote(anecdote)
    props.setNotification({text: `you voted for "${anecdote.content}"`, time: 5})
  }

  return (
    <div>
      {props.filteredAnecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      )}
    </div>
  )
}

const anecdotesToShow = ({ anecdotes, filter }) => {
  return (
    anecdotes.filter(a => filter
      ? a.content.toLowerCase().indexOf(filter.toLowerCase()) > -1
      : a
    )
    .sort((a, b) => b.votes - a.votes)
  )
}

const mapStateToProps = (state) => {
  return {
    filteredAnecdotes: anecdotesToShow(state),
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)