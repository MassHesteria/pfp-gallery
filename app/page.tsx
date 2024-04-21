import { fetchMetadata } from "frames.js/next";
import { getHostName } from "./frames";
import { kv } from '@vercel/kv';

export async function generateMetadata() {
  const routeUrl = new URL("/frames", getHostName())
  const metaData = await fetchMetadata(routeUrl);
  return {
    title: "PFP Gallery",
    description: "Bookmark and view PFPs",
    metadataBase: new URL(getHostName()),
    other: metaData,
  };
}

export default async function Page() {
  const user = await kv.get<string>('user:more');
  return (
    <div className="pl-2 pt-2">
      <div>Mic check</div>
      <div>{user}</div>
    </div>
  )
}
