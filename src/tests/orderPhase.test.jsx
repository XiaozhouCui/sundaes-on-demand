import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';

test('order phases for happy path', async () => {
  // render app
  // don't need to wrap in provider, already wrapped in App
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');
  // no need to await chocolate because vanilla is already rendered
  const chocolateInput = screen.getByRole('spinbutton', { name: 'Chocolate' });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');

  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });
  userEvent.click(cherriesCheckbox);

  // find and click order button
  const orderSummaryButton = screen.getByRole('button', {
    name: /order sundae/i,
  });
  userEvent.click(orderSummaryButton); // this should take you to the summary page

  // check summary information based on order
  const summaryHeading = screen.getByRole('heading', { name: 'Order Summary' });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole('heading', { name: 'Scoops: $6.00' });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole('heading', {
    name: 'Toppings: $1.50',
  });
  expect(toppingsHeading).toBeInTheDocument();

  // check summary option items
  expect(screen.getByText('1 Vanilla')).toBeInTheDocument();
  expect(screen.getByText('2 Chocolate')).toBeInTheDocument();
  expect(screen.getByText('Cherries')).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const tcCheckbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  userEvent.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole('button', {
    name: /confirm order/i,
  });
  userEvent.click(confirmOrderButton); // this should take you to the confirmation page

  // expect "Loading..." to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // confirm order number on confirmation page
  // this is async because there is a POST request to server
  const thankYouHeader = await screen.findByRole('heading', {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  // expect that loading has disappeared, need ".queryByText()" for non-exist elements
  const notLoading = screen.queryByText('Loading...');
  expect(notLoading).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderButton = screen.getByRole('button', { name: /new order/i });
  userEvent.click(newOrderButton); // this will bring you to the order entry page

  // check that scoops and toppings subtotals have been reset
  const scoopsTotal = screen.getByText('Scoops total: $0.00');
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText('Toppings total: $0.00');
  expect(toppingsTotal).toBeInTheDocument();

  // do we need to await anything to avoid test errors?
  await screen.findByRole('spinbutton', { name: 'Vanilla' });
  await screen.findByRole('checkbox', { name: 'Cherries' });
});
