# Dragon Example Images

This folder needs the following dragon images for the 3-step workflow:

## Step 1: Upload your product
**File:** `dragon-twitter.jpg` or use Twitter URL directly
- Source: Twitter image you showed me (the detailed fantasy dragon)
- Currently using: `https://pbs.twimg.com/media/GbqbqWHWsAATUPn?format=jpg&name=large`

## Step 2: Style the Scene
**File:** `dragon-paper-cut.jpg`
- Source: The paper-cut style dragon image you showed me
- This shows the styled/processed version from HotendWeekly app

## Step 3: Create & Share
**File:** `dragon-3d-render.jpg`
- Source: A 3D rendered version or final shareable result
- This should show the final output ready for social media/sharing
- IDEAL: A 3D model render of the dragon

## How to Add Images

1. Save your dragon images to `/public/examples/` folder with these exact filenames
2. Or update the src paths in `src/app/page.tsx` to match your actual filenames

The code currently references:
- Step 1: Twitter URL (already working)
- Step 2: `/examples/dragon-paper-cut.jpg`
- Step 3: `/examples/dragon-3d-render.jpg`
