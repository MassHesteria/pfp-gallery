import { kv } from '@vercel/kv';

export default async function Page() {
  const user = await kv.get<string>('user:more');
  return (
    <div className="pl-2 pt-2">
      <div>Mic check</div>
      <div>{user}</div>
    </div>
  )
}
