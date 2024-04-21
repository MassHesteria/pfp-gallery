/* eslint-disable react/jsx-key */
import { NextRequest } from "next/server";
import { addPFP, frames } from "../frames";
import { getUserDataForFid } from "frames.js";

type ActionResponse = {
  name: string; // An action name up to 30 characters.
  icon: string; // An icon ID. See "Valid Icons"
  description: string; // A short description up to 80 characters.
  aboutUrl: string; // External link to an "about" page for extended description.
  action: {
    type: 'post'
  }
}

export async function GET(req: NextRequest) {
  const info: ActionResponse = {
    name: 'Save PFP to Gallery',
    icon: 'pin',
    description: 'Bookmark your favorite PFPs for convenient viewing in the PFP Gallery frame',
    aboutUrl: 'https://pfp-gallery.vercel.app',
    action: {
      type: 'post'
    }
  }
  return Response.json(info)
}

export async function POST(req: NextRequest) {
  let message = 'not ready yet'

  const handleRequest = frames(async (ctx: any) => {
    if (!ctx.message || !ctx.message.isValid) {
      throw new Error('Could not validate request')
    }
    const requesterFid = ctx.message.requesterFid
    const fid = ctx.message.castId?.fid
    if (!fid || !requesterFid) {
      throw new Error('Could not validate request')
    }
    console.log(JSON.stringify(ctx))
    const userData = await getUserDataForFid({ fid })
    if (userData && userData.profileImage) {
      const res = await fetch(userData.profileImage)

      if (!res.ok) {
        message = 'Failed image fetch'
        return {
          image: <div></div>
        }
      }

      const blob = await res.blob()
      const contentType = blob.type
      console.log('contentType:',contentType)
      if (contentType.toLowerCase().includes('svg')) {
        message = `Invalid: ${contentType}`
      } else {
        await addPFP(requesterFid, { url: userData.profileImage, fid })
        message = `Added PFP for ${userData.displayName}`
      }
    }
    return {
      image: <div></div>
    }
  })

  await handleRequest(req)

  return Response.json({ message })
}
