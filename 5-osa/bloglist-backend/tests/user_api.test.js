const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('when there is initially some users saved', async () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers
      .map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    expect(response.body.length).toBe(helper.initialUsers.length)
  })

  describe('addition of a new user', async () => {
    test('a valid user can be added', async () => {
      const newUser = {
        username: 'new_user',
        name: 'New User',
        password: 'newpass'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(helper.initialUsers.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(
        'new_user'
      )
    })

    test('without password fails with status 400', async () => {
      const newUser = {
        username: 'new_user',
        name: 'New User',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(helper.initialUsers.length)
    })

    test('without username fails with status 400', async () => {
      const newUser = {
        name: 'New User',
        password: 'qwertyqwerty'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(helper.initialUsers.length)
    })

    test('with too short username fails with status 400', async () => {
      const newUser = {
        username: 'Nu',
        name: 'New User',
        password: 'qwertyqwerty'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(helper.initialUsers.length)
    })

    test('without unique username fails with status 400', async () => {
      const newUser = {
        username: 'new_user',
        name: 'New User',
        password: 'qwertyqwerty'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(helper.initialUsers.length + 1)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})