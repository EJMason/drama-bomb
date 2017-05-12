import { eventChannel } from 'redux-saga'
import { actions } from '../Redux/Duck.Login'

import { getProfile } from '../Services/AuthServices'

export const createLockChannel = lock => {
  return eventChannel(emit => {
    const handler = ({ type, payload }) => {
      emit({ type, payload })
    }

    lock.on('show', () => {
      handler(actions.lockOpenEvent())
    })

    lock.on('hide', () => {
      handler(actions.lockCloseEvent())
    })

    lock.on('authenticated', payload => {
      getProfile(lock, payload.accessToken)
        .then(profile => {
          payload.profile = profile
          handler(actions.lockAuthenticated(payload))
        })
    })

    lock.on('authorization_error', payload => {
      handler(actions.authError(payload))
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

