## Project setup

- Create the app using create-react-app
- Install eslint plugins `npm install eslint-plugin-testing-library eslint-plugin-jest-dom`
- Remove `eslintConfig` from _package.json_
- Create _.eslintrc.json_, _.prettierrc_ and add standard config
- Make sure VS Code plugins for eslint and prettier are installed
- Create _.vscode/settings.json_ and add standard config

## React Bootstrap setup

- Install packages `npm i react-bootstrap bootstrap`
- Add js links to _public/index.html_:
  - Go to [this link](https://react-bootstrap.netlify.app/getting-started/introduction/#browser-globals), and copy the links under **Browser Globals**
- Add css import to _src/index.js_:
  - Go to [this link](https://react-bootstrap.netlify.app/getting-started/introduction/#css), and copy the js import for _bootstrap.min.css_ under **CSS**.

## Install user-events

- Install packages `npm install @testing-library/user-event @testing-library/dom`
- Replace the `fireEvent` with `userEvent` from `@testing-library/user-event`
- `userEvent` can perform various actions: _click, hover, unhover, type, clear_ etc.

## Install Mock Service Worker (msw)

- Install package `npm install msw`
- Create _src/mocks/handlers.js_ and add handlers to simulate http responses
- Create _src/mocks/server.js_ to configure a request mocking server with the given request handlers
- Create/Update _src/setupTests.js_ to connect Mock Service Worker to the React app created by CRA
- Mock Service Worker (msw) will intercept the network requests, and return the response from handlers
- Install axios `npm install axios`
- In _src/pages/entry/Options.jsx_, use axios in `useEffect` to fetch data from the mock server (localhost:3030)
