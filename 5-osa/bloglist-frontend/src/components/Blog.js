import React, { useState } from 'react'
import blogService from './../services/blogs'
import { useField } from './../hooks/index'

const Blog = ({setBlogs, blogs, blog, name}) => {
  const [visible, setVisible] = useState(false)

  const user = blog.user
    ? blog.user
    : { id: null, name: null }


  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeBlog = async () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: user
    }

    try {
      await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs
        .map(b => b.id !== blog.id
          ? b
          : {...b, likes: b.likes + 1}
        )
        .sort((a, b) => b.likes - a.likes)
      )
    } catch (exception) {
      console.log(exception)
    }
  }

  const removeBlog = async () => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs
          .filter(b => b.id !== blog.id))
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div onClick={() => toggleVisibility()} className="contentButton">
        {blog.title} {blog.author}
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <p>{blog.url}</p>
        <p>{blog.likes} likes <button onClick={() => likeBlog()}>like</button></p>
        <p>added by {user.name}</p>
        {user.name === name &&
        <button onClick={() => removeBlog()}>remove</button>
        }
      </div>
    </div>
)}

const BlogForm = ({ blogs, setBlogs, blogService , user, sendStatusMessage}) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title.input.value,
      author: author.input.value,
      url: url.input.value
    }

    try {
      const returnedBlog = await blogService.create(blogObject, user)
      setBlogs(blogs.concat(returnedBlog))
      sendStatusMessage(`a new blog ${title.value} by ${author.value} added`)
      title.reset()
      author.reset()
      url.reset()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <form onSubmit={addBlog}>
      <div>title: <input {...title.input} /></div>
      <div>author: <input {...author.input} /></div>
      <div>url: <input {...url.input} /></div>
      <div><button type="submit">create</button></div>
    </form>
  )
}


export default {
  Blog,
  BlogForm
}