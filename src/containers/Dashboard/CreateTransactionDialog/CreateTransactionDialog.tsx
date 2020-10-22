import React, { useState, ReactNode, useEffect } from "react";
import { Button } from "@material-ui/core";
import { ThunkDispatch } from "redux-thunk";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/index";
import {
  createTransaction,
  ITransactionData,
} from "../../../store/transactions/actions";
import {
  IDialogProps,
  IForm,
  elType,
  elConfigType,
  IFormElement,
  IValidate,
} from "../../../interfaces";
import ButtonCircularProgress from "../../../components/ui/ButtonCircularProgress/ButtonCircularProgress";
import HighlitedInformation from "../../../components/ui/HighlitedInformation/HighlightedInformation";
import {
  FormInput,
  AsyncAutocomplete,
} from "../../../components/ui/input/input";
import FormDialog from "../../../components/ui/formDialog/formDialog";
import { baseURL } from "../../../api/api";

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => {
  return {
    onCreateTransaction: (transactionData: ITransactionData) =>
      dispatch(createTransaction(transactionData)),
  };
};

const mapStateToProps = (state: RootState) => ({
  isLoading: state.transactions.loading,
  error: state.transactions.error,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type CreateTransactionDialogProps = PropsFromRedux & IDialogProps;

interface IUserOption {
  id: number;
  name: string;
}

const CreateTransactionDialog: React.FC<CreateTransactionDialogProps> = ({
  open,
  onClose,
  title,
  onCreateTransaction,
  isLoading,
  error,
}) => {
  const [userValue, setUserValue] = useState<IUserOption | null>(null);
  const [userInputValue, setUserInputValue] = useState("");
  const [userOptions, setUserOptions] = useState<IUserOption[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<IForm>({
    controls: {
      name: {
        elType: elType.asyncAutocomplete,
        elConfig: {
          autoFocus: true,
        },
        value: "",
        validation: {
          required: true,
          valid: false,
        },
        touched: false,
        label: "User name",
      },
      amount: {
        elType: elType.input,
        value: "",
        elConfig: {
          type: elConfigType.number,
        },
        validation: {
          required: true,
          valid: false,
        },
        touched: false,
        label: "Amount",
      },
    },
    formIsValid: false,
  });

  useEffect(() => {
    let active = true;
    setUserLoading(true);
    if (userInputValue === "") {
      setUserOptions(userValue ? [userValue] : []);
      return undefined;
    }

    (async () => {
      const token: string | null = localStorage.getItem("token");
      if (token) {
        const response = await fetch(baseURL + "/api/protected/users/list", {
          method: "POST",
          body: JSON.stringify({
            filter: userInputValue,
          }),
          credentials: "include",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
        const options = await response.json();

        if (active) {
          let newOptions = [] as IUserOption[];

          if (userValue) {
            newOptions = [userValue];
          }
          if (options) {
            newOptions = [...newOptions, ...options];
          }
          setUserOptions(newOptions);
        }
      }
    })();

    return () => {
      setUserLoading(false);
      active = false;
    };
  }, [userValue, userInputValue]);

  const onUserChange = (event: any, newValue: IUserOption | null) => {
    inputChangedHandler(event, "name");
    setUserOptions(newValue ? [newValue, ...userOptions] : userOptions);
    setUserValue(newValue);
  };

  const onUserInputChange = (event: any, newInputValue: string) => {
    setUserInputValue(newInputValue);
  };
  const checkValidity = (value: string, validation: IValidate) => {
    let { valid, validationErrors, ...rules } = { ...validation };
    valid = true;
    validationErrors = [];

    if (rules.required && value.trim() === "") {
      valid = false;
      validationErrors.push("Field is required");
    }

    return { ...validation, valid, validationErrors };
  };

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    controlName: string
  ) => {
    const updatedControls = {
      ...formState.controls,
      [controlName]: {
        ...formState.controls[controlName],
        value: event.target.value,
        validation: checkValidity(
          event.target.value,
          formState.controls[controlName].validation
        ),
        touched: true,
      },
    };
    let formIsValid = true;
    for (let inputId in updatedControls) {
      formIsValid = updatedControls[inputId].validation.valid && formIsValid;
    }
    setFormState({
      controls: updatedControls,
      formIsValid: formIsValid,
    });
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState.formIsValid) {
      const { name, amount } = formState.controls;
      const transactionData: ITransactionData = {
        name: name.value,
        amount: parseInt(amount.value),
      };
      onCreateTransaction(transactionData);
    }
  };

  const formElementsArray: IFormElement[] = [];
  for (let key in formState.controls) {
    formElementsArray.push({
      id: key,
      config: formState.controls[key],
    });
  }
  const formContent = formElementsArray.map((formElement) => {
    if (formElement.config.elType === elType.asyncAutocomplete) {
      return (
        <AsyncAutocomplete
          control={formElement.config}
          changed={onUserChange}
          inputChanged={onUserInputChange}
          value={userValue}
          options={userOptions}
          loading={userLoading}
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

  const errorsInfo = error ? (
    <HighlitedInformation>{error}</HighlitedInformation>
  ) : null;
  const formActions: ReactNode = (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="secondary"
      disabled={isLoading || !formState.formIsValid}
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
      onSubmit={submitHandler}
      open={open}
      loading={isLoading}
    />
  );
};

export default connector(CreateTransactionDialog);
