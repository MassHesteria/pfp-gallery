/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { State, frames, getHostName } from "../frames";
import { kv } from '@vercel/kv';

const handleRequest = frames(async (ctx: any) => {
  const timestamp = `${Date.now()}`
  const baseRoute = getHostName() + "/frames?ts=" + timestamp
  const state = ctx.state as State;

  if (ctx.message) {
    if (!ctx.message.isValid) {
      throw new Error('Could not validate request')
    }
    console.log(JSON.stringify(ctx))
    const fid = 373258
    let values = await kv.lrange(`${fid}:bookmarks`, 0, -1)
    if (values.length <= 0) {
      return {
        image: (
          <div>Install Action and Bookmark PFPs</div>
        ),
        buttons: [
          <Button action="post" target={baseRoute}>
            Click
          </Button>,
        ],
      }
    }

    if (ctx.pressedButton) {
      if (ctx.pressedButton.index == 1) {
        state.index = (state.index + 1) % values.length
      } else if (ctx.pressedButton.index == 2) {
        await kv.lrem(`${fid}:bookmarks`, 0, values[state.index])
        values = await kv.lrange(`${fid}:bookmarks`, 0, -1)
        state.index %= values.length
      }
      //console.log(ctx.pressedButton.index)
      //kv.set('user:more', msg)
    }


    return {
      image: values[state.index],
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button action="post" target={baseRoute}>
          Next ⏭
        </Button>,
        <Button action="post" target={baseRoute}>
          Remove ❌
        </Button>,
      ],
      state
    }
  }

  return {
    image: (
      <div tw="flex flex-row w-full h-full">
        <div tw="flex flex-col m-auto w-5/6">
          <div tw="flex mx-auto text-5xl">PFPs == Art</div>
          <div tw="flex flex-col text-red-700 mt-3 text-center">
            <span tw="mx-auto">The <u tw="mx-2">Save PFP to Gallery</u>action allows you to</span>
            <span tw="mx-auto">view your favorite PFPs in this frame</span>
          </div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={baseRoute}>
        View PFPs
      </Button>,
      <Button action="post" target={baseRoute}>
        Install Action
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;