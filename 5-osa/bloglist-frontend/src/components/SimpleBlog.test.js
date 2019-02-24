import React from 'react'
import 'jest-dom/extend-expect'
import { render, fireEvent } from 'react-testing-library'
import SimpleBlog from './SimpleBlog'

test('renders content', () => {
  const blog = {
    title: 'Testing title',
    author: 'Test Author',
    likes: 123,
  }

  const component = render(
    <SimpleBlog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'Testing title'
  )

  expect(component.container).toHaveTextContent(
    'Test Author'
  )

  expect(component.container).toHaveTextContent(
    '123'
  )
})

it('clicking the button twice calls event handler twice', async () => {
  const blog = {
    title: 'Testing title',
    author: 'Test Author',
    likes: 123,
  }

  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})