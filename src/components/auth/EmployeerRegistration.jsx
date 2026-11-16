import React from "react";
import Input from "../Ui/Input";
import Button from "../Ui/Button";

function EmployeerRegistration() {
  return (
    <div className="registration">

      <h1>Employeer Registration</h1>

      <Input
        type="email"
        placeholder="Email"
      />

      <Input
        type="password"
        placeholder="Password"
      />

      <Input
        type="password"
        placeholder="Confirm Password"
      />

      <Input
        type="text"
        placeholder="Company Name"
      />

      <Input
        type="text"
        placeholder="Company Address"
      />

      <Input
        type="text"
        placeholder="Contact Number"
      />

      <Button>
        Register
      </Button>

    </div>
  );
}

export default EmployeerRegistration;