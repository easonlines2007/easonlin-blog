import { adminHandlers } from '../src/server/admin-api.ts'

export const GET = (request: Request) => adminHandlers.get(request)
export const POST = (request: Request) => adminHandlers.mutate(request)
export const PUT = (request: Request) => adminHandlers.mutate(request)
export const DELETE = (request: Request) => adminHandlers.mutate(request)
