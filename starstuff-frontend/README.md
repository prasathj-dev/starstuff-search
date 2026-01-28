##### Starstuff Frontend (Universal Search)

This is the UI layer for the Universal Search experience, built with SvelteKit 5 and Tailwind CSS. It focuses on accessibility, speed, and a keyboard-first user experience.

## Tech Stack

- Framework: SvelteKit 5 (using Runes for state management)

- Styling: Tailwind CSS

- Icons: SVG Icons

- State Management: Svelte 5 $state and $derived runes

## Key Frontend Features

**- 1. Keyboard-First UX -**

    - The search modal can be opened anywhere using Cmd + K (Mac) or Ctrl + K (Windows/Linux). we listen globally for the shortcut so it’s always available without messing with native browser shortcuts.

**- 2. Debounced Input -**

     - To avoid hitting the API on every keystroke, input is debounced by 300ms. This keeps results feeling responsive but prevents unnecessary server calls.

**- 3. Sveltekit 5 Reactivity -**

    - i'm using Svelte 5’s new reactive features to manage the search flow:

    - $state – tracks the query ,result list , loading and error state.

    - $derived – automatically groups or filters results by type (Users, Spaces, Communities) as they arrive.

    - $effect – calls the API whenever the user types a query.

**- 4. Grouped Results & Feedback**

    - Even though the backend returns a flat list, i group results by type on the frontend for easier scanning. Empty and loading states are handled with skeletons or “No results found” messages to improve perceived performance.

**- 5. Grouped Results & Feedback**

    - i use AbortController to cancel any pending API requests when the user types a new query, ensuring we don’t process outdated results and saving unnecessary network calls.

```bash

npm install # install packages
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Project Structure

- /src/lib/components — Reusable UI components (SearchModal, ResultItem, etc.)
- /src/lib/components/icons — Reusable ICONS
- /src/lib/hooks — Keyboard shortcuts and debounce logic
- /src/routes — Main application pages
- /src/routes/api/+server.ts — To handle the external API
- /src/routes/layout.css — Tailwind directives and global styles

## Technical Decisions

**- SvelteKit 5 -**: The new Runes API makes managing complex state, like a global search modal with dynamic results, easier and less prone to memory leaks than previous versions.

**-Tailwind CSS -**: The search modal requires precise positioning and "glassmorphism" effects. Tailwind lets us iterate quickly without bloated CSS.

**-Data Fetching -**: We fetch data reactively from the Express backend, ensuring the UI stays in sync with the user’s input.

## Testing

- I added some basic tests for the main components to make sure they work. Later, I plan to add more tests for things like API calls, debounce, canceling requests with AbortController, and grouped results.

- This shows that testing is set up and more tests will be added as the project grows.

## Future Improvements

- Command Palette Actions: Extend the modal beyond search to include actions (e.g., Cmd + K → "Create New Space ,Go to My Profile").

- Result Caching: Add a client-side cache to instantly show results for recently searched queries.

- Virtual Scrolling: For large result sets (100+ items), implement virtual lists to maintain smooth 60fps scrolling.
