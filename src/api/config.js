import EntitiesConfig, { entities } from 'redux-capacitor'

import { records, schemas } from './records'
import resourceConfig from './resource_config'
import ApiClient from './client'

const SWApiClient = new ApiClient({baseUrl: 'https://swapi.co/api/'})

EntitiesConfig.configure({
  schemas,
  records,
  resourceConfig,
  apiClient: SWApiClient // new ApiClient()
})

export {
  ApiClient,
  entities
}
