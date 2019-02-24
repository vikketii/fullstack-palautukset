import React from 'react'

const Notification = ({ statusMessage }) => {
  if (statusMessage === null) {
    return null
  }

  const notificationStyle = {
    color: 'grey',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={notificationStyle}>
      {statusMessage}
    </div>
  )
}

export default Notification