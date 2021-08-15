import {
  render,
  screen,
  waitFor,
} from '../../../test-utils/testing-library-utils';
import OrderEntry from '../OrderEntry';
import { rest } from 'msw';
import { server } from '../../../mocks/server';

test('handles error for scoops and toppings routes', async () => {
  // override the server handlers, to return 500 error
  server.resetHandlers(
    rest.get('http://localhost:3030/scoops', (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get('http://localhost:3030/toppings', (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  // testing-library-utils will override "render" method, auto wrap <OrderEntry> with Provider
  render(<OrderEntry />);

  // async, need to hit the .catch() function in axios, but only wait for one of scoops/toppings, not both
  // to wait for both requests, need "waitFor"
  await waitFor(async () => {
    // 'alert' role is defined in react-bootstrap/alert
    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(2);
  });
});
