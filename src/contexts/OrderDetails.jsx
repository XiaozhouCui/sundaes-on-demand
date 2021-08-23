import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { pricePerItem } from '../constants';
import { formatCurrency } from '../utilities';

const OrderDetails = createContext();

// create custom hook to check whether we are inside a provider
export function useOrderDetails() {
  const context = useContext(OrderDetails);
  // if no ncotext, we are not in a provider
  if (!context) {
    throw new Error(
      'useOrderDetails must be used within an OrderDetailsProvider'
    );
  }
  // if no error, that means we are wrapped in a provider
  return context;
}

function calculateSubtotal(optionType, optionCounts) {
  // go through the Map and sum up the option
  let optionCount = 0;
  // the .values() on the Map to access value
  for (let count of optionCounts[optionType].values()) {
    optionCount += count;
  }

  return optionCount * pricePerItem[optionType];
}

// provider is a functional component
export function OrderDetailsProvider(props) {
  // local state to store option counts
  const [optionCounts, setOptionCounts] = useState({
    scoops: new Map(), // use Map for subtotal calculation
    toppings: new Map(),
  });
  const zeroCurrency = formatCurrency(0);
  // another piece of state to store totals
  const [totals, setTotals] = useState({
    scoops: zeroCurrency,
    toppings: zeroCurrency,
    grandTotal: zeroCurrency,
  });

  // update the totals whenever optionCounts change
  useEffect(() => {
    const scoopsSubtotal = calculateSubtotal('scoops', optionCounts);
    const toppingsSubtotal = calculateSubtotal('toppings', optionCounts);
    const grandTotal = scoopsSubtotal + toppingsSubtotal;
    setTotals({
      scoops: formatCurrency(scoopsSubtotal),
      toppings: formatCurrency(toppingsSubtotal),
      grandTotal: formatCurrency(grandTotal),
    });
  }, [optionCounts]);

  // stop component from being re-calculated
  const value = useMemo(() => {
    function updateItemCount(itemName, newItemCount, optionType) {
      const newOptionCounts = { ...optionCounts };
      // update option count for this item with the new value
      const optionCountsMap = optionCounts[optionType];
      optionCountsMap.set(itemName, parseInt(newItemCount));
      // update state to concain this information
      setOptionCounts(newOptionCounts);
    }
    // return an array of a getter and a setter
    // getter: object containing the option option countes for scoops and toppings, subtotals and totals
    // setter: updateOptionCount
    return [{ ...optionCounts, totals }, updateItemCount];
  }, [optionCounts, totals]);
  return <OrderDetails.Provider value={value} {...props} />;
}
