import React, { useState, ReactNode } from "react";
import { Button } from "@material-ui/core";
import {
  IAuthForm,
  IValidate,
  elType,
  elConfigType,
  IFormElement,
  IDialogProps,
} from "../../interfaces";
import Input from "../../components/ui/input/input";
import FormDialog from "../../components/ui/formDialog/formDialog";

const RegisterFormDialog: React.FC<IDialogProps> = ({ onClose, open }) => {
  const [showPwd, setShowPwd] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPwd((prevState: boolean) => !prevState);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const [authFormState, setAuthFormState] = useState<IAuthForm>({
    controls: {
      email: {
        elType: elType.input,
        elConfig: {
          type: elConfigType.email,
          placeholder: "Email address",
          autoFocus: true,
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
          valid: false,
        },
        touched: false,
        label: "E-mail",
      },
      name: {
        elType: elType.input,
        elConfig: {
          type: elConfigType.text,
          placeholder: "Name",
        },
        value: "",
        validation: {
          required: true,
          valid: false,
        },
        touched: false,
        label: "Name",
      },
      password: {
        elType: elType.passwordInput,
        elConfig: {
          type: elConfigType.password,
          placeholder: "Password",
          handleClickShowPassword,
          handleMouseDownPassword,
          showPwd,
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
          valid: false,
        },
        touched: false,
        label: "Password",
      },
      repeatPassword: {
        elType: elType.passwordInput,
        elConfig: {
          type: elConfigType.password,
          placeholder: "Repeat password",
          handleClickShowPassword,
          handleMouseDownPassword,
          showPwd,
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
          valid: false,
          passwordRepeat: true,
        },
        touched: false,
        label: "Repeat password",
      },
    },
    formIsValid: false,
  });

  const checkValidity = (value: string, validation: IValidate) => {
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

    if (rules.isEmail) {
      const pattern = /^\S+@\S+\.\S+$/;
      if (!pattern.test(value)) {
        valid = false;
        validationErrors.push("Email is not valid");
      }
    }

    if (rules.passwordRepeat) {
      if (value !== authFormState.controls["password"].value) {
        valid = false;
        validationErrors.push("Password not matching");
      }
    }

    return { ...validation, valid, validationErrors };
  };

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    controlName: string
  ) => {
    const updatedControls = {
      ...authFormState.controls,
      [controlName]: {
        ...authFormState.controls[controlName],
        value: event.target.value,
        validation: checkValidity(
          event.target.value,
          authFormState.controls[controlName].validation
        ),
        touched: true,
      },
    };
    let formIsValid = true;
    for (let inputId in updatedControls) {
      formIsValid = updatedControls[inputId].validation.valid && formIsValid;
    }
    setAuthFormState({
      controls: updatedControls,
      formIsValid: formIsValid,
    });
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, email, password } = authFormState.controls;
    //TODO dispath auth

    onClose();
  };

  const formElementsArray: IFormElement[] = [];
  for (let key in authFormState.controls) {
    formElementsArray.push({
      id: key,
      config: authFormState.controls[key],
    });
  }
  const formContent: ReactNode = formElementsArray.map((formElement) => (
    <Input
      key={formElement.id}
      changed={(event: any) => inputChangedHandler(event, formElement.id)}
      control={formElement.config}
    />
  ));
  const formActions: ReactNode = (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="secondary"
      // disabled={isLoading}
      size="large"
    >
      REGISTER
      {/* {isLoading && <ButtonCircularProgress />} */}
    </Button>
  );
  return (
    <FormDialog
      actions={formActions}
      content={formContent}
      title="REGISTER"
      onClose={onClose}
      onSubmit={submitHandler}
      open={open}
      //TODO loading from redux here
      loading={false}
    />
  );
};

export default RegisterFormDialog;
