const baseActions = {
  list: { method: 'get' },
  create: { method: 'post' },
  fetch: { method: 'get' },
  update: { method: 'patch' },
  destroy: { method: 'delete' }
}

const resourceConfig = {
  people: {
    endpoint: 'people',
    actions: baseActions
  },
  planet: {
    endpoint: 'planets',
    actions: baseActions
  }
}

export default resourceConfig
