import { fork } from 'redux-saga/effects'

import EntitiesModule from 'redux-capacitor/module'

function * rootSaga () {
  yield [
    fork(EntitiesModule.rootSaga),
  ]
}

export default rootSaga
