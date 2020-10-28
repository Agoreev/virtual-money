import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Paper,
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link, useLocation, Redirect } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/index";
import { auth, authErrorClear, getUserInfo } from "../../store/auth/actions";
import {
  IForm,
  IValidate,
  elType,
  elConfigType,
  IFormElement,
  IAuthData,
} from "../../interfaces";
import ButtonCircularProgress from "../../components/ui/ButtonCircularProgress";
import HighlitedInformation from "../../components/ui/HighlightedInformation";
import { FormInput, PasswordInput } from "../../components/ui/Input";
import Copyright from "../../components/copyright";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => {
  return {
    onAuth: (authData: IAuthData, isSignUp: boolean) =>
      dispatch(auth(authData, isSignUp)),
    onAuthErrorClear: () => dispatch(authErrorClear()),
    onGetUserInfo: () => dispatch(getUserInfo()),
  };
};

const mapStateToProps = (state: RootState) => ({
  isLoading: state.auth.loading,
  error: state.auth.error,
  isLoggedIn: !!state.auth.user?.id,
  userLoading: state.auth.loading,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Auth: React.FC<PropsFromRedux> = ({
  onAuth,
  onAuthErrorClear,
  onGetUserInfo,
  isLoading,
  error,
  isLoggedIn,
  userLoading,
}) => {
  const classes = useStyles();

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

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      onGetUserInfo();
    }
  }, [onGetUserInfo]);

  const location = useLocation();
  const isRegister = location.pathname === "/register";

  const [loginState, setLoginState] = useState<IForm>({ ...initialLoginState });
  const [registerState, setRegisterState] = useState<IForm>({
    ...initialRegisterState,
  });

  const [showPwd, setShowPwd] = useState<boolean>(false);

  const token: string | null = localStorage.getItem("token");
  if (userLoading && token) {
    return (
      <Box display="flex" mt={3} justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  const handleClickShowPassword = () => {
    setShowPwd((prevState: boolean) => !prevState);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
    const state = isRegister ? registerState : loginState;
    const setState = isRegister ? setRegisterState : setLoginState;
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

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRegister) {
      if (registerState.formIsValid) {
        const { email, password, name } = registerState.controls;
        const authData: IAuthData = {
          email: email.value,
          password: password.value,
          username: name.value,
        };
        const isSignUp: boolean = true;
        onAuth(authData, isSignUp);
      }
    } else {
      if (loginState.formIsValid) {
        const { email, password } = loginState.controls;
        const authData: IAuthData = {
          email: email.value,
          password: password.value,
        };
        const isSignUp: boolean = false;
        onAuth(authData, isSignUp);
      }
    }
  };

  const formElementsArray: IFormElement[] = [];
  if (isRegister) {
    for (let key in registerState.controls) {
      formElementsArray.push({
        id: key,
        config: registerState.controls[key],
      });
    }
  } else {
    for (let key in loginState.controls) {
      formElementsArray.push({
        id: key,
        config: loginState.controls[key],
      });
    }
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
  const formActions = (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="secondary"
      disabled={
        isLoading ||
        (isRegister ? !registerState.formIsValid : !loginState.formIsValid)
      }
      size="large"
    >
      {isRegister ? "REGISTER" : "LOGIN"}
      {isLoading && <ButtonCircularProgress />}
    </Button>
  );

  if (isLoggedIn) {
    return <Redirect to="/transactions" />;
  }

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Box display="flex" justifyContent="space-around" width="300px">
            <Link to="/">
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
            </Link>
            <Link to="/register">
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Register
              </Typography>
            </Link>
          </Box>
          <form onSubmit={submitHandler}>
            {formContent}
            {formActions}
            {errorsInfo}
          </form>
          <Box mt={3}>
            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default connector(Auth);
