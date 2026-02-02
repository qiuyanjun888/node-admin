import { userHandlers } from './system/user'
import { roleHandlers } from './system/role'
import { permissionHandlers } from './system/permission'

export const handlers = [...userHandlers, ...roleHandlers, ...permissionHandlers]
