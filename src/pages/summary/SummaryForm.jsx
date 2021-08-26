import React, { useState } from 'react';
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap';

const SummaryForm = ({ setOrderPhase }) => {
  const [tcChecked, setTcChecked] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // pass along to the next phase.
    // the next page will handle submitting order from context
    setOrderPhase('completed'); // take back to confirmation page
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>No ice cream will actually be delivered</Popover.Content>
    </Popover>
  );

  const checkboxLabel = (
    <span>
      I agree to{' '}
      <OverlayTrigger placement="right" overlay={popover}>
        <span style={{ color: 'blue' }}>Terms and Conditions</span>
      </OverlayTrigger>
    </span>
  );

  return (
    <Form onSubmit={handleSubmit}>
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

export default SummaryForm;
