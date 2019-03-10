import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_ANECDOTE':
      return [ ...state, action.data ]
    case 'VOTE':
      const id = action.data.id
      const anecdoteToChange = state.find(a => a.id === id)
      const votesNow = anecdoteToChange.votes + 1
      const changedAnecdote = { ...anecdoteToChange,
        votes: votesNow
      }
      return state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state;
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const voteAnecdote = (anecdote) => {
  const updatedObject = {
    id: anecdote.id,
    content: anecdote.content,
    votes: anecdote.votes + 1
  }
  return async dispatch => {
    await anecdoteService.update(anecdote.id, updatedObject)
    dispatch({
      type: 'VOTE',
      data: { id: anecdote.id }
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

export default anecdoteReducer