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


export const createServerEventChannel = (source, id) => {
  return eventChannel(emit => {
    // This is what executes after event is recieved
    const handler = data => { emit(JSON.parse(data)) }

    source.addEventListener(`${id}`, event => {
      console.log('AN EVENT HAS BEEN FIRED: ', event)
      handler(event.data)
    }, false)

    source.addEventListener('error', err => { console.log('IS THIS IT? ', err) })

    console.log('\nAM I GETTING HERE?\n\n')
    const unsubscribe = () => {
      source.close()
    }
    return unsubscribe
  })
}
