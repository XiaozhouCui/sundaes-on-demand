import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library-utils';

import Options from '../Options';

// http req is async, need to use "await" and "findBy" (cannot use "getBy")

test('displays image for each scoop option from server', async () => {
  // testing-library-utils will override "render" method, auto wrap <Options> with OrderDetailsProvider
  render(<Options optionType="scoops" />);
  // find all images by "alt" attribute, alt should end with "scoop"
  const scoopImages = await screen.findAllByRole('img', { name: /scoop$/i });
  // msw handler is returning 2 options: vanilla and chocolate
  expect(scoopImages).toHaveLength(2);
  // confirm alt text of images
  const altText = scoopImages.map((element) => element.alt);
  expect(altText).toEqual(['Chocolate scoop', 'Vanilla scoop']);
});

test('displays image for each topping option from server', async () => {
  render(<Options optionType="toppings" />);
  const toppingImages = await screen.findAllByRole('img', {
    name: /topping$/i,
  });
  expect(toppingImages).toHaveLength(3);
  const altText = toppingImages.map((element) => element.alt);
  expect(altText).toEqual([
    'Cherries topping',
    'M&Ms topping',
    'Hot fudge topping',
  ]);
});

test("don't update total if scoops input is invalid", async () => {
  render(<Options optionType="scoops" />);

  // expect button to be enabled after adding scoop
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '-1');

  // make sure scoops subtital hasn't updated, subtotal needs custom render method to include context provider
  const scoopsSubtotal = screen.getByText('Scoops total: $0.00');
  expect(scoopsSubtotal).toBeInTheDocument();
});
