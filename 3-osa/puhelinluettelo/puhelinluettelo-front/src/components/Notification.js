import React from 'react'

const Notification = ({ statusMessage }) => {
  if (statusMessage.message === null) {
    return null
  }

  let notificationStyle = {}
  if (statusMessage.status === 'good') {
    notificationStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
  } else if (statusMessage.status === 'bad') {
    notificationStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
  }

  return (
    <div style={notificationStyle}>
      {statusMessage.message}
    </div>
  )
}

export default Notification