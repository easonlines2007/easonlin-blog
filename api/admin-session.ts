import { adminHandlers } from '../src/server/admin-api.ts'

export const GET = (request: Request) => adminHandlers.session(request)
export const POST = (request: Request) => adminHandlers.session(request)
export const DELETE = (request: Request) => adminHandlers.session(request)
