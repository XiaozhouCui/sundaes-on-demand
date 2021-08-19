import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderDetailsProvider } from '../../../contexts/OrderDetails';
import Options from '../Options';

// test scoop subtotal
test('update scoop subtotal when scoops chagne', async () => {
  // need to wrap <Options> inside a context/redux/router provider
  render(<Options optionType="scoops" />, { wrapper: OrderDetailsProvider });

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false }); // "Scoops total: $" doesn't need to be the entire string
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  userEvent.clear(vanillaInput); // clear the user input
  userEvent.type(vanillaInput, '1'); // enter text "1"
  expect(scoopsSubtotal).toHaveTextContent('2.00'); // 1 vanilla scoop is $2

  // update chocolate scoops to 2 and check the subtotal again
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  userEvent.clear(chocolateInput); // clear the user input
  userEvent.type(chocolateInput, '2'); // enter text "2"
  expect(scoopsSubtotal).toHaveTextContent('6.00'); // each chocolate scoop is $2
});

// test toppings subtotal
test('update toppings subtotal when scoops chagne', async () => {
  // render parent component
  render(<Options optionType="toppings" />, { wrapper: OrderDetailsProvider });

  // make sure total starts out $0.00
  const toppingsTotal = screen.getByText('Toppings total: $', { exact: false }); // match sub-string
  expect(toppingsTotal).toHaveTextContent('0.00');

  // find checkbox for Cherries, need to await to be populated by axios call
  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries', // from msw handlers
  });
  userEvent.click(cherriesCheckbox);
  expect(toppingsTotal).toHaveTextContent('1.50'); // 1 topping is $1.50

  // add hot fudge and check subtotal
  const hotFuudgeCheckbox = await screen.findByRole('checkbox', {
    name: 'Hot fudge', // from msw handlers
  });
  userEvent.click(hotFuudgeCheckbox);
  expect(toppingsTotal).toHaveTextContent('1.50'); // 2 toppings cost $3.00

  // remove hot fudge and check subtotal
  userEvent.click(hotFuudgeCheckbox);
  expect(toppingsTotal).toHaveTextContent('1.50'); // 1 Cherries topping is $1.50
});
