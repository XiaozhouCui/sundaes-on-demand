import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Options from '../Options';

// test scoop subtotal
test('update scoop subtotal when scoops chagne', async () => {
  render(<Options optionType="scoops" />);

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
