const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    })

    if (blog.title === undefined) {
      return response.status(400).json({ error: 'title is missing' })
    } else if (blog.url === undefined) {
      return response.status(400).json({ error: 'url is missing' })
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())

  } catch(exception) {
    response.status(400).json({ error: exception })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(401).json({ error: 'no permission to delete blog' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()

  } catch(exception) {
    response.status(400).json({ error: exception })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = new Blog(request.body)

  if (blog.title === undefined) {
    return response.status(400).json({ error: 'title is missing' })
  } else if (blog.url === undefined) {
    return response.status(400).json({ error: 'url is missing' })
  }

  await Blog.findByIdAndUpdate(blog.id, blog, { new: true })
  response.status(200).end()
})

module.exports = blogsRouter
