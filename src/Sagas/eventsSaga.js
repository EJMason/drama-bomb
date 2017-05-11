import { eventChannel } from 'redux-saga'

export const createLockChannel = lock => {
  return eventChannel(emit => {
    const handler = ({ type, payload }) => {
      emit({ type, payload })
    }

    lock.on('show', payload => {
      handler({ type: 'AUTH/OPEN_LOCK', payload })
    })
    lock.on('hide', payload => {
      handler({ type: 'AUTH/CLOSE_LOCK', payload })
    })
    lock.on('authenticated', payload => {
      handler({ type: 'AUTH/AUTHENTICATED', payload })
    })
    lock.on('authorization_error', payload => {
      handler({ type: 'AUTH/AUTH_ERROR', payload })
    })

    const unsubscribe = () => {
      localStorage.removeItem('id_token')
      localStorage.removeItem('profile')
    }
    return unsubscribe
  })
}

export const createListenerChannel = () => {
  console.log('This is the channel for server listener')
}

