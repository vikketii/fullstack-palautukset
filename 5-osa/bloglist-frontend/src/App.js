import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  const sendStatusMessage = message => {
    setStatusMessage(message)
    setTimeout(() => {
      setStatusMessage(null)
    }, 3000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      sendStatusMessage('wrong username or password')
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  return (
    <div>
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
      <h2>blogs</h2>
      <Notification statusMessage={statusMessage} />
      {/* <p>{user.name} logged in</p> */}
      <button onClick={handleLogout}>logout</button>

      <Blog.BlogForm blogs={blogs} setBlogs={setBlogs}
      blogService={blogService} user={user}
      sendStatusMessage={sendStatusMessage} />

      {blogs.map(blog =>
        <Blog.Blog key={blog.id} setBlogs={setBlogs}
        blogs={blogs} blog={blog} name={user.name} />
      )}
    </div>
  )
}

export default App