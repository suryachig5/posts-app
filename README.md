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
| Testing                        | Vitest, React Testing Library, and jsdom        |

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

`npm run lint` checks the source. `npm run format:check` checks formatting, and `npm run format` applies it. `npm run build` type-checks and builds the app to `dist/`. `npm run preview` serves that build locally.

## Source layout

- `routes/` defines routes, loading fallbacks, and an error boundary for unexpected rendering or lazy-loading failures.
- `pages/` contains the feed and detail screens.
- `components/` contains shared components that are used to build the pages.
- `components/LoadingSkeletons/` contains the loading placeholders and shimmer styles.
- `hooks/` defines the TanStack Query calls and cache reuse.
- `api/` contains the Axios REST client, response validation, and shared query keys.
- `store/` defines the Zustand stores for search, filters, and favorite post IDs.
- `styles/` contains shared design tokens and base styles.

## State and data flow

**TanStack Query owns server state.** The feed fetches posts and comments in parallel and renders posts as soon as they arrive. Comment counts come from grouping comments by post ID. The detail page reuses cached feed data when available. A direct visit with an empty cache fetches only the selected post and its comments.

**Zustand owns client state.** Search text, active filters, and favorite post IDs live in Zustand. Search and filters stay in memory during navigation. Favorite IDs are saved in `localStorage` so favorites survive a browser restart. The feed applies search and filters locally to the posts in the query cache.

**How post details reuse feed data.** The post and its comments load independently. When the feed already has either one, the detail page can reuse it without resetting its freshness timer. If the corresponding feed request is still running, the detail page waits for it and makes a request for just that post or its comments if it still needs the data. Waiting avoids duplicate requests, but a slow request for all comments can delay the selected post’s thread. For a larger feed, the API could include comment counts with each post so the app can fetch full threads only when opened.

**Filter navigation trade-off.** Filters are kept in Zustand so typing and changing filters leave the URL and browser history alone. As a result, filtered views cannot be shared by URL, and Back returns to the previous page in the history. If shareable views become a requirement, the URL can own search and filters while Zustand continues to own saved favorites.

**API validation.** Axios responses are checked at the API boundary before they enter the query cache. Malformed payloads follow the existing error and retry paths.

The user dropdown is built from the posts’ user IDs. In Favorites, it lists users with saved posts. “More posts by this user” opens the filtered feed, and “Reset filters” clears all active filters.

## Scaling the feed

- **Comment counts.** The JSONPlaceholder post payload has no comment count, so the feed fetches the roughly 500 comments in one request and groups them by post ID. That keeps counts available without making a request for each card, at the cost of downloading comment bodies on the feed. With a backend we control, each paginated post would include its comment count and the detail route would fetch the selected thread on demand.
- **Pagination and search.** At 100 posts, local search provides immediate results and the complete list is small enough to render. If the feed grows, we can check how it loads, searches, and scrolls on a lower-end phone. Cursor pagination would shrink the initial download, and server-side search would still let users find posts beyond the pages they’ve loaded. We could debounce those requests so typing doesn’t send one per keystroke. If keeping more cards on screen starts to slow scrolling, we can render just the cards in and around the viewport.

## Component conventions

Declare component prop types after the imports and before the components. Keep helper-only types near the helpers that use them.

Use one top-level JSX return per React component so the layout is easy to understand. Define supporting functions below the return or below the component, in the order they first appear in the JSX. Helpers can use early returns for distinct cases, such as loading and error states, and leave the normal result as the final return.

## Tests

Vitest runs on the app's own Vite config, so tests use the same React plugin, SCSS module handling and TypeScript pipeline, with no separate Babel setup or style mocks. Components and hooks are tested with React Testing Library and user-event in jsdom.

Run `npm test` once, `npm run test:watch` while editing, or `npm run test:coverage` to enforce 95% global coverage for branches, functions, lines, and statements.

GitHub Actions runs a clean install, formatting, lint, coverage, and the type-checked production build on pull requests and pushes to `main`. ESLint checks React Hooks, JSX accessibility, import ordering, and function complexity.
