import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const OrderSummary = () => {
  const [tcChecked, setTcChecked] = useState(false);

  const checkboxLabel = <span>I agree to Terms and Conditions</span>;
  return (
    <Form>
      <Form.Group controlId="terms-and-conditions">
        <Form.Check
          type="checkbox"
          checked={tcChecked}
          onChange={(e) => setTcChecked(e.target.checked)}
          label={checkboxLabel}
        />
      </Form.Group>
      <Button disabled={!tcChecked} type="submit" variant="primary">
        Confirm Order
      </Button>
    </Form>
  );
};

export default OrderSummary;
