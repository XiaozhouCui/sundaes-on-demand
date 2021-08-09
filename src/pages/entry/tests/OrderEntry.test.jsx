import { render, screen } from '@testing-library/react';
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

  // render order entry
  render(<OrderEntry />);

  // async, need to hit the .catch() function in axios
  const alerts = await screen.findAllByRole('alert', {
    // 'alert' role is defined in react-bootstrap
    name: 'An unexpected error ocurred, Please try again later.',
  });

  expect(alerts).toHaveLength(2);
});
