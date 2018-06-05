import {
  schemasFromFieldDefinitions,
  recordsFromFieldDefinitions
} from 'redux-capacitor'
import * as normalizr from 'normalizr'

const baseFields = {
  id: null
}

const fieldDefinitions = {
  people: {
    ...baseFields,
    url: null,
    name: null,
    homeworld: null
  },
  planet: {
    ...baseFields,
    name: null
  }
}

const records = recordsFromFieldDefinitions(fieldDefinitions)

const schemas = schemasFromFieldDefinitions(fieldDefinitions)

// You can manually set up the idAttribute used in the store as keys for this record type
schemas.people = new normalizr.schema.Entity('people', {}, { idAttribute: record => record.url })

schemas.people.define({
  homeworld: schemas.planet
})

export {
  schemas,
  records
}
