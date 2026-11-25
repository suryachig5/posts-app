# Posts App

A responsive React and TypeScript feed with post details, comments, search, saved favorites, and user filtering.

## Tech stack

| Area                           | Technology                                      |
| ------------------------------ | ----------------------------------------------- |
| UI                             | React and TypeScript                            |
| Routing                        | React Router                                    |
| API                            | Axios and the JSONPlaceholder REST API          |
| Server state                   | TanStack Query for fetching and caching         |
| Client state                   | Zustand for state management                    |
| Styling                        | SCSS with shared design tokens and Lucide icons |
| Build, linting, and formatting | Vite, ESLint, and Prettier                      |
| Testing                        | Jest, React Testing Library, and jsdom          |

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

`npm run lint` checks the source. `npm run format:check` checks formatting, and `npm run format` applies it. `npm run build` type-checks and builds the app to `dist/`. `npm run preview` serves that build locally.

## Source layout

- `routes/` defines the routes along with their loading and fallback views.
- `pages/` feed and detail screens.
- `components/` contains shared components that are used to build the pages.
- `components/LoadingSkeletons/` contains the loading placeholders and shimmer styles.
- `hooks/` defines the TanStack Query calls and cache reuse.
- `api/` contains the Axios REST client and response types.
- `store/` persists favorite IDs with Zustand.
- `styles/` contains shared design tokens and base styles.

The feed fetches all posts and comments in parallel. It groups comments by post ID to calculate counts and searches post titles and bodies locally. The detail page reuses cached feed data when available. If you open a post directly with an empty cache, it fetches only that post and its comments. Search, Favorites, and the user filter stay in memory as you navigate. The user dropdown is built from the posts’ user IDs. In Favorites it lists users with saved posts. “More posts by this user” opens the filtered feed, and “Reset filters” clears all active filters. The app saves favorite post IDs in `localStorage` so favorites are still available after you close and reopen the browser.

## Component conventions

Declare component prop types after the imports and before the components. Keep helper-only types near the helpers that use them.

Use one top-level JSX return per React component so the layout is easy to understand. Define supporting functions below the return or below the component, in the order they first appear in the JSX. Helpers can use early returns for distinct cases, such as loading and error states, and leave the normal result as the final return.

## Tests

Run `npm test` for the Jest suite, `npm run test:watch` while editing, or
`npm run test:coverage` for a coverage report. Tests live beside the source
they cover. Shared mock data and test setup live in `src/test/`.
