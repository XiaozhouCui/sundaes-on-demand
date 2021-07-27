import { fireEvent, render, screen } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

test('Checkbox is unchecked by default', () => {
  render(<OrderSummary />);
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
});

test('Checking checkbox enables button, unchecking checkbox disables button', () => {
  render(<OrderSummary />);
  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  const confirmButton = screen.getByRole('button', { name: /confirm order/i });
  fireEvent.click(checkbox);
  expect(confirmButton).toBeEnabled();
  fireEvent.click(checkbox);
  expect(confirmButton).toBeDisabled();
});
