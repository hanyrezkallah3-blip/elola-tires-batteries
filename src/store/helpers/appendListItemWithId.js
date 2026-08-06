const appendListItemWithId = (list = [], item = {}) => {
  const createId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2)

  return [
    {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...item
    },
    ...list
  ]
}

export default appendListItemWithId
