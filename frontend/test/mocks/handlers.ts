import { userHandlers } from './system/user'
import { roleHandlers } from './system/role'

export const handlers = [...userHandlers, ...roleHandlers]
