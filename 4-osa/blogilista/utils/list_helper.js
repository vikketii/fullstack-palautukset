const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined

  const reducer = (prev, curr) => prev.likes > curr.likes ? prev : curr
  const result = blogs.reduce(reducer)

  const blog = {
    title: result.title,
    author: result.author,
    likes: result.likes,
  }

  return blog
}


module.exports = {
  totalLikes,
  favoriteBlog
}