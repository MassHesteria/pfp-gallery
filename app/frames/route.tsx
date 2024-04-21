/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { State, frames, getHostName, getPFPs, removePFP } from "../frames";
import { getUserDataForFid } from "frames.js";

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
    let values = await getPFPs(fid)
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
        await removePFP(fid, values[state.index])
        values = await getPFPs(fid)
        state.index %= values.length
      }
      //console.log(ctx.pressedButton.index)
      //kv.set('user:more', msg)
    }

    const pfp = values[state.index]
    const userData = await getUserDataForFid({ fid: pfp.fid })
    const profileLink = `https://warpcast.com`
    let buttonText = userData?.displayName
    if (!buttonText) {
      buttonText = 'No profile available'
    }

    // Show remove button for manage mode
    if (state.manage) {
      return {
        image: pfp.url,
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
          <Button action="link" target={profileLink}>
            {buttonText}
          </Button>,
        ],
        state
      }
    }

    return {
      image: pfp.url,
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button action="post" target={baseRoute}>
          Next ⏭
        </Button>,
        <Button action="link" target={profileLink}>
          {buttonText}
        </Button>,
      ],
      state
    }
  }

  const installLink = 'https://warpcast.com/~/add-cast-action?url=' +
    encodeURIComponent(getHostName() + '/action')

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
      <Button action="link" target={installLink}>
        Install Action
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;