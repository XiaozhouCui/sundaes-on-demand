import { render, screen } from '@testing-library/react';

import Options from '../Options';

// http req is async, need to use "await" and "findBy" (cannot use "getBy")

test('displays image for each scoop option from server', async () => {
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
