import { mottoHandlers } from '../src/server/motto-api.ts'

export async function GET(request: Request) {
  return mottoHandlers.get(request)
}

export async function PUT(request: Request) {
  return mottoHandlers.put(request)
}
