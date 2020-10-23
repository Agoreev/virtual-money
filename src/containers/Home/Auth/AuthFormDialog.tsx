import React, { useState, ReactNode } from "react";
import { Button } from "@material-ui/core";
import { ThunkDispatch } from "redux-thunk";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/index";
import { auth, authErrorClear } from "../../../store/auth/actions";
import {
  IForm,
  IValidate,
  elType,
  elConfigType,
  IFormElement,
  IDialogProps,
  IAuthData,
} from "../../../interfaces";
import ButtonCircularProgress from "../../../components/ui/ButtonCircularProgress/ButtonCircularProgress";
import HighlitedInformation from "../../../components/ui/HighlitedInformation/HighlightedInformation";
import { FormInput, PasswordInput } from "../../../components/ui/input/input";
import FormDialog from "../../../components/ui/formDialog/formDialog";

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => {
  return {
    onAuth: (authData: IAuthData, isSignUp: boolean) =>
      dispatch(auth(authData, isSignUp)),
    onAuthErrorClear: () => dispatch(authErrorClear()),
  };
};

const mapStateToProps = (state: RootState) => ({
  isLoading: state.auth.loading,
  error: state.auth.error,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type AuthFormDialogProps = PropsFromRedux & IDialogProps;

const AuthFormDialog: React.FC<AuthFormDialogProps> = ({
  open,
  onClose,
  dialogType,
  title,
  onAuth,
  onAuthErrorClear,
  isLoading,
  error,
}) => {
  let state: IForm | null = null;
  const initialLoginState: IForm = {
    controls: {
      email: {
        elType: elType.input,
        elConfig: {
          type: elConfigType.email,
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
      password: {
        elType: elType.passwordInput,
        value: "",
        validation: {
          required: true,
          valid: false,
        },
        touched: false,
        label: "Password",
      },
    },
    formIsValid: false,
  };
  const initialRegisterState: IForm = {
    controls: {
      email: {
        elType: elType.input,
        elConfig: {
          type: elConfigType.email,
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
  };
  switch (dialogType) {
    case "login":
      state = {
        ...initialLoginState,
      };
      break;
    case "register":
      state = {
        ...initialRegisterState,
      };
      break;
  }
  const [authFormState, setAuthFormState] = useState<IForm>(state!);

  const [showPwd, setShowPwd] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPwd((prevState: boolean) => !prevState);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // Cleans dialog form on dialog exit
  const onDialogExited = () => {
    switch (dialogType) {
      case "login":
        setAuthFormState({ ...initialLoginState });
        break;
      case "register":
        setAuthFormState({ ...initialRegisterState });
        break;
    }
    onAuthErrorClear();
    setShowPwd(false);
  };

  const checkValidity = (value: string, validation: IValidate) => {
    let { valid, validationErrors, ...rules } = { ...validation };
    valid = true;
    validationErrors = [];

    if (rules.required && value.trim() === "") {
      valid = false;
      validationErrors.push("Field is required");
    }

    if (rules.isEmail) {
      const pattern = /^\S+@\S+\.\S+$/;
      if (!pattern.test(value)) {
        valid = false;
        validationErrors.push("Email is not valid");
      }
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
    if (authFormState.formIsValid) {
      if (dialogType === "login") {
        const { email, password } = authFormState.controls;
        const authData: IAuthData = {
          email: email.value,
          password: password.value,
        };
        const isSignUp: boolean = false;
        onAuth(authData, isSignUp);
      } else if (dialogType === "register") {
        const { email, password, name } = authFormState.controls;
        const authData: IAuthData = {
          email: email.value,
          password: password.value,
          username: name.value,
        };
        const isSignUp: boolean = true;
        onAuth(authData, isSignUp);
      }
    }
  };

  const formElementsArray: IFormElement[] = [];
  for (let key in authFormState.controls) {
    formElementsArray.push({
      id: key,
      config: authFormState.controls[key],
    });
  }
  const formContent = formElementsArray.map((formElement) => {
    if (formElement.config.elType === elType.passwordInput) {
      return (
        <PasswordInput
          key={formElement.id}
          changed={(event: React.ChangeEvent<HTMLInputElement>) =>
            inputChangedHandler(event, formElement.id)
          }
          handleMouseDownPassword={handleMouseDownPassword}
          handleClickShowPassword={handleClickShowPassword}
          showPwd={showPwd}
          control={formElement.config}
        />
      );
    } else {
      return (
        <FormInput
          key={formElement.id}
          changed={(event: any) => inputChangedHandler(event, formElement.id)}
          control={formElement.config}
        />
      );
    }
  });

  const errorsInfo =
    error && error !== "UnauthorizedError: jwt expired\n" ? (
      <HighlitedInformation>{error}</HighlitedInformation>
    ) : null;
  const formActions: ReactNode = (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="secondary"
      disabled={isLoading || !authFormState.formIsValid}
      size="large"
    >
      {title}
      {isLoading && <ButtonCircularProgress />}
    </Button>
  );
  return (
    <FormDialog
      actions={formActions}
      content={formContent}
      info={errorsInfo}
      title={title}
      onClose={onClose}
      onExited={onDialogExited}
      onSubmit={submitHandler}
      open={open}
      loading={isLoading}
    />
  );
};

export default connector(AuthFormDialog);
