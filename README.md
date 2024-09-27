# MuseIt

Rewrite of MuseIt frontend. Tech stack, in summary:

- `pnpm`: performant and more deterministic (vs npm)
- `Typescript` (>>> JS)
- `Vite`: fast build tooling
- `SolidJS`: performant, easier to debug and mildly cleaner
- `Tailwind CSS`: inline css for this smaller project
- `solid-ui`: component library, based on shadcn
  - the components in `src/components/ui` are all added via the solid-ui cli
- `solid-zustand`: store based state management
- `solid-query`: async query management based from Tanstack Query

## Things to note

**Filepath based Routing**

Not enforced but ideally pages go in `src/pages` and added to `src/routes.ts`

## Template Info

> Started with a template copied from [here](https://github.com/solidjs/templates/tree/main/ts-router)

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

This template's goal is to showcase the routing features of Solid.
It also showcase how the router and Suspense work together to parallelize data fetching tied to a route via the `.data.ts` pattern.

You can learn more about it on the [`@solidjs/router` repository](https://github.com/solidjs/solid-router)

> Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
