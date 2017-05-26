import { eventChannel } from 'redux-saga'
import { actions } from '../Redux/Duck.Login'

import { getProfile } from '../Services/AuthServices'


export const createLockChannel = lock => {
  return eventChannel(emit => {
    const handler = ({ type, payload }) => {
      console.log('DATA RECIEVED: ', payload)
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


export const createServerEventChannel = (source, id) => {
  return eventChannel(emit => {
    // This is what executes after event is recieved
    const handler = data => {
      data = JSON.parse(data)
      data.friends_ids = data.friends_ids ? Object.keys(data.friends_ids) : []
      data.haters = data.haters ? Object.keys(data.haters).map(key => data.haters[key]) : []
      emit(data)
    }

    source.addEventListener(`${id}`, event => {
      handler(event.data)
    }, false)

    source.addEventListener('error', err => {
      console.error('SSE ERROR ', err)
      /*
        Here we want to do something if there is an error
        Probably want to relog them in using the token saved
        in localstorage. If that doesn't work log them out
      */
    }, false)

    const unsubscribe = () => {
      // just this needs to be done on logout
      source.close()
    }
    return unsubscribe
  })
}
