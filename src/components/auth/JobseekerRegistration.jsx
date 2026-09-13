import React from "react";
import Input from "../Ui/Input";
import Button from "../Ui/Button";

function JobSeekerRegistration() {
  return (
    <div className="registration">

      <h1>Job Seeker Registration</h1>

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
        placeholder="Full Name"
      />

      <Input
        type="text"
        placeholder="Username"
      />

      <Input type="date" />

      <Input
        type="text"
        placeholder="Skills"
      />

      <Input
        type="text"
        placeholder="Education"
      />

      <Button>
        Register
      </Button>

    </div>
  );
}

export default JobSeekerRegistration;