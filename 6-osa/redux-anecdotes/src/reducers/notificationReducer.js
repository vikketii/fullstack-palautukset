const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'REMOVE_NOTIFICATION':
      return ''
    default:
      return state
  }
}

const notificationChange = notification => {
  return {
    type: 'SET_NOTIFICATION',
    notification,
  }
}

const notificationRemove = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
  }
}

export const setNotification = ({text, time}) => {
  return async dispatch => {
    dispatch(notificationChange(text))
    setTimeout(() => {
      dispatch(notificationRemove())
    }, time * 1000)
  }
}

export default notificationReducer