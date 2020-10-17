import React, { useState } from "react";

const Auth: React.FC = () => {
  const [state, setState] = useState({
    controls: {
      email: {
        elType: "input",
        elConfig: {
          type: "email",
          placeholder: "Email address",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
          valid: false,
        },
        touched: false,
      },
      password: {
        elType: "input",
        elConfig: {
          type: "password",
          placeholder: "Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
          valid: false,
        },
        touched: false,
      },
    },
    formIsValid: false,
    isSignUp: true,
  });

  const checkValidity = (value, validation) => {
    let { valid, validationErrors, ...rules } = { ...validation };
    valid = true;
    validationErrors = [];

    if (rules.required && value.trim() === "") {
      valid = false;
      validationErrors.push("Field is required");
    }

    if (rules.minLength && value.length < rules.minLength) {
      valid = false;
      validationErrors.push(`Minimum length is ${rules.minLength}`);
    }

    if (rules.maxLength && value.length <= rules.maxLength) {
      valid = false;
      validationErrors.push(`Maximum length is ${rules.maxLength}`);
    }

    if (rules.isEmail) {
      const pattern = /^\S+@\S+\.\S+$/;
      if (!pattern.test(value)) {
        valid = false;
        validationErrors.push("Email is not valid");
      }
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      if (!pattern.test(value)) {
        valid = false;
        validationErrors.push("Enter numeric value");
      }
    }
    const newValidation = {
      ...validation,
      valid,
      validationErrors,
    };
    return newValidation;
  };

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...state.controls,
      [controlName]: {
        ...state.controls[controlName],
        value: event.target.value,
        validation: checkValidity(
          event.target.value,
          state.controls[controlName].validation
        ),
        touched: true,
      },
    };
    let formIsValid = true;
    for (let inputId in updatedControls) {
      formIsValid = updatedControls[inputId].validation.valid && formIsValid;
    }
    setState({
      controls: updatedControls,
      formIsValid: formIsValid,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const { email, password } = state.controls;
    const { isSignUp } = state;
    //TODO dispath auth
  };

  const switchAuthModeHandler = () => {
    setState((prevState) => {
      return {
        isSignUp: !prevState.isSignUp,
      };
    });
  };

  return <div className="Auth"></div>;
};
