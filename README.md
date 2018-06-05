# Installation Steps

## Installing Capacitor

```
yarn add redux-capacitor
```

## Necessary files/configurations

NOTE: Not important that they be at these locations, this is just a helpful way to separate these.

```
src/api/config.js
src/api/records.js
src/api/resource_config.js
```

### src/api/conifg.js

Import this throughout the rest of the app to use `entities(<entities_config>)(Component)` wrappers

```
import { entities } from './api/config
```

### src/api/records.js

Record and Schema definitions used by redux-capacitor

More on usage below

### src/api/resource_config.js

Configuration of the endpoints and actions available on those endpoints

GET base_url + 'people'
POST base_url + 'people'

More on usage below

---------------------------

# Store setup

## Reducers

redux, react-redux, redux-saga, and immutable are all dependencies of the redux-capacitor package and included by installing redux-capacitor

We can use the EntitiesModule root reducer in setting up the store. Redux-capacitor needs this piece of store to exist
```
import EntitiesModule from 'redux-capacitor/module'

const store = createStore(EntitiesModule.rootReducer)
```

## Immutability in the store

Need to have an immutable store, because redux-capacitor expects that

## Other packages

Some setup required for redux sagas, but the package is included by redux-capacitor

Redux-thunk is used

## Records and Ids

The selector `containerItems` needs that each record has an Id that is unique in order to correctly build the full list of items in the store.
Otherwise you get a single record in items and a bunch of `missingIds` due to repeatedly setting the same key in the store object.

If your API does not provide ids, this can be configured in the ApiClient used to hydrate records with Ids

# Usage

## Basic entities-wrapped component

Options:
autoload
getId
defaultFilters

## item and items

## isLoading and isFetched

Actions are dispatched when making requests to set loading states that can be accessed like so:
```
this.props.collection.isLoading // bool
this.props.collection.isFetched // bool
```

## Filters

An Immutable.Map of filters that is persisted to the store

See `updateFilters` for more

## Loading data later

Sometimes you want to fetch data after a component has already mounted, or perform mutations on a collection for edits/deletions/creations

### performAction

To use `performAction`, you must specify these actions first in your resource_config file

```
this.props.collection.performAction('actionName', { performActionOptions })
```

PerformAction Options:
* itemId: In POST /contacts/:id this would populate the `:id`
* data: In POST /contacts this would be body request data
* filters: In GET /contacts this would be query params used in fetching the resource
* onSuccess: Callback that gets called when ApiClient promise resolves
* onError: 

### updateFilters

When you have an existing collection that you simply want to refetch using an updated set of filters

```
this.props.collection.updateFilters({filters: {search: 'Luke'}})
```

NOTE: Current filters are persisted to the redux store, and will be maintained on subsequent requests unless specifically modified

You can use the following to reset the filters, just passing exactly what is desired

```
this.props.collection.updateFilters({filters: {search: 'Luke'}, resetFilters: true})
```

## Resource configuration

Base actions can be utilized for setting up the primary CRUD actions
```
const baseActions = {
  list: { method: 'get' },
  create: { method: 'post' },
  fetch: { method: 'get' },
  update: { method: 'patch' },
  destroy: { method: 'delete' }
}
```

You can use these in a resource config which should be shaped like the following per each resource type

Here is an example that allows for leveraging the base actions, plus some individual actions for this resource

```
task: {
  endpoint: 'tasks',
  actions: {
    ...baseActions,
    setActive: { method: 'post', path: 'active' },
    setInactive: { method: 'post', path: 'inactive' }
  }
}
```

Tying this together with `performAction`, this resource configuration would allow for the following:

```
// Where `tasks` is the name of the collection set up in `entities({tasks: {type: 'task'}})(Component)`
this.props.tasks.performAction('setActive', {
  itemId: 'task_1' // the ID of the task we are modifying
})
```

## Records configuration

### Basic record setup
Creating records take a shape like the following, where each item in this object will be available to the collection

```
people: {
  id: null,
  url: null,
  name: null,
  homeworld: null
}
```

NOTE: even though more attributes are returned via the API, only those listed here will be available to `this.props.collection.item[attribute]`

### Setting which ids to use for keys in the store
Modifying which attribute gets used as the ID on a record

```
// /api/records.js

schemas.people = new normalizr.schema.Entity('people', {}, { idAttribute: record => record.url })
```

This is often not needed if the API returns records that have a unique ID, but could be utilized for getting a specific store structure

### Nesting associations inside the Records returned in item and items
Redux-capacitor can hydrate records with any nested associations if it has the schema set up here.

For example, if `record.js` defines both the people and planet schemas, you can configure the record to have homeworld with a Record corresponding to the fetched planets in the store

```
// /api/records.js

schemas.people.define({
  homeworld: schemas.planet
})
```
