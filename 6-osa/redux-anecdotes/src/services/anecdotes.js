import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const resp = await axios.get(baseUrl)
  return resp.data
}

const createNew = async content => {
  const resp = await axios.post(baseUrl, { content, votes: 0 })
  return resp.data
}

const update = async (id, newObject) => {
  const resp = await axios.put(`${baseUrl}/${id}`, newObject)
  return resp.data
}

export default {
  getAll,
  createNew,
  update
}