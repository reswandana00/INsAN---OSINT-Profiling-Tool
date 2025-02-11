import InstaScrapper from './InstaScrapper'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { username } = await request.json()
  const result = await InstaScrapper(username)
  return NextResponse.json(result)
}
