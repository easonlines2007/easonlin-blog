import { mottoHandlers } from '../src/server/motto-api.ts'

export async function POST(request: Request) {
  return mottoHandlers.login(request)
}

export async function DELETE(request: Request) {
  return mottoHandlers.logout(request)
}
