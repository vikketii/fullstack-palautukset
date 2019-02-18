const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', async () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('blogs are identified by id', async () => {
    const response = await api.get('/api/blogs')
    response.body
      .forEach(blog => expect(blog.id).toBeDefined())
  })

  test('likes are zero if not defined', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.likes).toBeDefined())
  })

  test('blog can be updated', async () => {
    const blogToUpdate = {
      _id: helper.initialBlogs[0]._id,
      title: 'Updated Blog',
      author: 'Updater',
      url: 'http://updatedblog.html',
      likes: 2
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'Updated Blog'
    )
  })

  describe('addition of a new blog', async () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Beginner',
        url: 'http://newblog.html',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain(
        'New Blog'
      )
    })

    test('blog missing title can not be added', async () => {
      const newBlog = {
        author: 'Beginner',
        url: 'http://newblog.html',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('blog missing title can not be added', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Beginner',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', async () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(
        blogsAtStart.length - 1
      )

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).not.toContain(blogToDelete.title)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})