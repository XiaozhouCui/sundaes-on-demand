// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// customise this config file, so the Mock Service Worker (msw) will intercept the network requests, and return the response from handlers

import { server } from './mocks/server.js';
// Establish API mocking before all tests.
beforeAll(() => server.listen()); // route requests to msw

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
