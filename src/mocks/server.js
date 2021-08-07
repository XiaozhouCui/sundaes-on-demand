import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers.
// "...handlers" will separate the array of handlers into multiple arguments
export const server = setupServer(...handlers);
