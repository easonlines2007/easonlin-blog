import { adminHandlers } from '../src/server/admin-api.ts'

export const PUT = (request: Request) => adminHandlers.pinTopic(request)
