/* eslint-disable react/jsx-key */
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return Response.json({})
}

export async function POST(req: NextRequest) {
  let message = 'not ready yet'
  return Response.json({ message })
}
