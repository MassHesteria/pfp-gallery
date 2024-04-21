import { farcasterHubContext } from "frames.js/middleware";
import { createFrames } from "frames.js/next";
import { headers } from "next/headers";
import { kv } from '@vercel/kv';

//-------------------------------------------------------------------
// Utility functions
//-------------------------------------------------------------------

export const getHostName = (): string => {
  if (process.env['HOST']) {
    return process.env['HOST']
  }
  const headersList = headers();
  const host = headersList.get('x-forwarded-host');
  const proto = headersList.get('x-forwarded-proto');
  return `${proto}://${host}`;
}

const getHubRoute = (): string => {
  if (process.env['VERCEL_REGION']) {
    return 'https://nemes.farcaster.xyz:2281'
  }
  return 'http://localhost:3010/hub'
}

export type PFP = {
  url: string;
  fid: number;
}

export const addPFP = async (fid: number, pfp: PFP) => {
  await kv.rpush(`${fid}:images`, pfp.url)
  await kv.rpush(`${fid}:users`, pfp.fid)
}

export const getPFPs = async (fid: number) => {
  let array: PFP[] = []
  let images = await kv.lrange(`${fid}:images`, 0, -1)
  let users = await kv.lrange<number>(`${fid}:users`, 0, -1)

  if (images.length <= 0) {
    return array
  }
  for (let i = 0; i < images.length; i++) {
    array.push({
      url: images[i],
      fid: i < users.length ? users[i] : 0
    })
  }

  return array
}

export const removePFP = async (fid: number, pfp: PFP) => {
  await kv.lrem(`${fid}:images`, 0, pfp.url)
  await kv.lrem(`${fid}:users`, 0, pfp.fid)
}

//-------------------------------------------------------------------
// Frame setup
//-------------------------------------------------------------------

export type State = {
  index: number;
  manage: boolean;
}
 
export const frames = createFrames<State>({
  middleware: [farcasterHubContext({
    hubHttpUrl: getHubRoute()
  })],
  initialState: {
    index: 0,
    manage: false
  }
});