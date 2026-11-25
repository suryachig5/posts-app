# Posts App

A React and TypeScript app that displays posts and comment counts from JSONPlaceholder. Axios handles HTTP requests, and TanStack Query fetches and caches the posts and comments independently.

```sh
npm ci
npm run dev
```

Run `npm run build` to type-check and build for production.

## Development checks

- `npm test` runs the Jest suite. Use `npm run test:watch` during development or `npm run test:coverage` for a coverage report.
- `npm run lint` checks the source with ESLint.
- `npm run format:check` checks formatting. Use `npm run format` to apply it.

## Design tokens

`src/styles/tokens.scss` defines shared CSS custom properties for colors, typography, spacing, and sizes such as the page width and touch target. Use the tokens directly in SCSS declarations, for example `gap: var(--space-3)`. Global styles load the tokens, and component styles live beside their components as SCSS modules.
