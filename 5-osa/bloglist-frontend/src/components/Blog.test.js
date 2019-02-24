import React from 'react'
import 'jest-dom/extend-expect'
import { render, fireEvent } from 'react-testing-library'
import Blog from './Blog'

describe('Togglable content', () => {
  let component

  const blog = {
    title: 'Testing title',
    author: 'Test Author',
    likes: 123,
  }

  beforeEach(() => {
    component = render(
      <Blog.Blog blog={blog} />
    )
  })

  it('renders name and writer', () => {
    expect(component.container).toHaveTextContent(
      'Testing title'
    )

    expect(component.container).toHaveTextContent(
      'Test Author'
    )
  })

  it('at start togglable information is not displayed', () => {
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  it('after clicking the button, togglable information is displayed', () => {
    const button = component.container.querySelector('.contentButton')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})