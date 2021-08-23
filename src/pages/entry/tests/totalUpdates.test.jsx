import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderDetailsProvider } from '../../../contexts/OrderDetails';
import Options from '../Options';
import OrderEntry from '../OrderEntry';
import { render, screen } from '../../../test-utils/testing-library-utils';

// test scoop subtotal
test('update scoop subtotal when scoops chagne', async () => {
  // need to wrap <Options> inside a context/redux/router provider
  rtlRender(<Options optionType="scoops" />, { wrapper: OrderDetailsProvider });

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
  rtlRender(<Options optionType="toppings" />, {
    wrapper: OrderDetailsProvider,
  });

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
  expect(toppingsTotal).toHaveTextContent('3.00'); // 2 toppings cost $3.00

  // remove hot fudge and check subtotal
  userEvent.click(hotFuudgeCheckbox);
  expect(toppingsTotal).toHaveTextContent('1.50'); // 1 Cherries topping is $1.50
});

describe('grand total', () => {
  test('grand total updates properly if scoop is added first', async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole('heading', {
      name: /grand total: \$/i,
    });

    // check that the grand total starts out at $0.00
    expect(grandTotal).toHaveTextContent('0.00');

    // update vanilla scoops to 2 and check grand total
    // need to wait for the options to show up on the page
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '2');
    expect(grandTotal).toHaveTextContent('4.00');

    // add cherries topping ($1.50) and check grand total
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries',
    });
    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('5.50');
  });

  test('grand total updates properly if topping is added first', async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole('heading', {
      name: /grand total: \$/i,
    });

    // add cherries topping ($1.50) and check grand total
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries',
    });
    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('1.50');

    // update vanilla scoops to 2 and check grand total
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '2');
    // (2 * 2 + 1.5 = $5.50)
    expect(grandTotal).toHaveTextContent('5.50');
  });

  test('grand total updates properly if item is removed', async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole('heading', {
      name: /grand total: \$/i,
    });

    // add cherries
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries',
    });
    userEvent.click(cherriesCheckbox); // grand totaal $1.50

    // update vanilla scoops to 2 and check grand total
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '2'); // grand total $5.50

    // remove 1 scoop of vanilla
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '1'); // grand total $3.50

    // remove cherries
    userEvent.click(cherriesCheckbox); // grand total $2.00
    expect(grandTotal).toHaveTextContent('2.00');
  });
});
