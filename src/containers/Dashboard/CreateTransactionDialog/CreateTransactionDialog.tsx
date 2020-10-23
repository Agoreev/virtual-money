import React, { useState, ReactNode, useEffect } from "react";
import { Button, Box } from "@material-ui/core";
import { ThunkDispatch } from "redux-thunk";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/index";
import {
  createTransaction,
  ITransactionData,
  createTransactionErrorClear,
} from "../../../store/transactions/actions";
import {
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
    onCreateTransactionErrorClear: () =>
      dispatch(createTransactionErrorClear()),
  };
};

const mapStateToProps = (state: RootState) => ({
  isLoading: state.transactions.loading,
  error: state.transactions.error,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface ICreateTransactionDialogProps {
  onClose: () => void;
  open: boolean;
  title: string;
  transactionValues?: ITransactionData | null;
}

type CreateTransactionDialogProps = PropsFromRedux &
  ICreateTransactionDialogProps;

const CreateTransactionDialog: React.FC<CreateTransactionDialogProps> = ({
  open,
  onClose,
  title,
  onCreateTransaction,
  onCreateTransactionErrorClear,
  isLoading,
  error,
  transactionValues,
}) => {
  const [userValue, setUserValue] = useState<string | null>(null);
  const [userInputValue, setUserInputValue] = useState("");
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);
  const initialFormState: IForm = {
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
          isNumeric: true,
        },
        touched: false,
        label: "Amount",
      },
    },
    formIsValid: false,
  };
  const [formState, setFormState] = useState<IForm>({
    ...initialFormState,
  });

  // Set initial values in form if it is repeated transaction
  useEffect(() => {
    if (transactionValues?.name && transactionValues?.amount) {
      setUserValue(transactionValues.name);
      setFormState((prevState) => {
        const updatedControls = { ...prevState.controls };
        const updatedName = { ...prevState.controls["name"] };
        const updatedAmount = { ...prevState.controls["amount"] };
        updatedName.value = transactionValues.name;
        updatedAmount.value = (transactionValues.amount * -1).toString();
        updatedName.validation = checkValidity(
          updatedName.value,
          updatedName.validation
        );
        updatedAmount.validation = checkValidity(
          updatedAmount.value,
          updatedAmount.validation
        );

        updatedControls["name"] = updatedName;
        updatedControls["amount"] = updatedAmount;

        let formIsValid = true;
        for (let inputId in updatedControls) {
          formIsValid =
            updatedControls[inputId].validation.valid && formIsValid;
        }
        return {
          controls: updatedControls,
          formIsValid,
        };
      });
    }
  }, [transactionValues]);

  // Fetch users from API on autocomplete input change
  useEffect(() => {
    let active = true;

    setUserError(null);
    if (userInputValue === "") {
      setUserOptions(userValue ? [userValue] : []);
      return undefined;
    }

    (async () => {
      const token: string | null = localStorage.getItem("token");
      if (token) {
        setUserLoading(true);
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
        if (!response.ok) {
          const err = await response.text();
          setUserError(err);
        } else {
          interface IOption {
            id: number;
            name: string;
          }
          const options: IOption[] = await response.json();

          if (active) {
            let newOptions = [] as string[];

            if (options.length > 0) {
              const optionStrings = options.map(
                (option: IOption) => option.name
              );
              newOptions = [...optionStrings];
            }
            setUserOptions(newOptions);
          }
        }
        setUserLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userValue, userInputValue]);

  // Cleans dialog form on dialog exit
  const onDialogExited = () => {
    setFormState({ ...initialFormState });
    setUserValue(null);
    setUserInputValue("");
    setUserOptions([]);
    setUserLoading(false);
    setUserError(null);
    onCreateTransactionErrorClear();
  };

  const onUserChange = (event: any, newValue: string) => {
    const newName = newValue ?? "";
    setUserOptions(newName ? [newName, ...userOptions] : userOptions);
    setUserValue(newName);
    const controlName: string = "name";

    // For user autocomplete input inputChangedHandler implemented here because it's value recieved not from event
    const updatedControls = {
      ...formState.controls,
      [controlName]: {
        ...formState.controls["name"],
        value: newName,
        validation: checkValidity(
          newName,
          formState.controls["name"].validation
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

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      if (!pattern.test(value) && parseInt(value) <= 0) {
        valid = false;
        validationErrors.push("Enter positive numeric value");
      }
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
      onClose();
      //TODO Notification here
    }
  };

  const formElementsArray: IFormElement[] = [];
  for (let key in formState.controls) {
    formElementsArray.push({
      id: key,
      config: formState.controls[key],
    });
  }
  const formContent = (
    <Box mt={2}>
      {formElementsArray.map((formElement) => {
        if (formElement.config.elType === elType.asyncAutocomplete) {
          return (
            <AsyncAutocomplete
              key={formElement.id}
              control={formElement.config}
              changed={onUserChange}
              inputChanged={onUserInputChange}
              value={userValue}
              options={userOptions}
              loading={userLoading}
              error={userError}
            />
          );
        } else {
          return (
            <FormInput
              key={formElement.id}
              changed={(event: any) =>
                inputChangedHandler(event, formElement.id)
              }
              control={formElement.config}
            />
          );
        }
      })}
    </Box>
  );

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
      onExited={onDialogExited}
      onSubmit={submitHandler}
      open={open}
      loading={isLoading}
    />
  );
};

export default connector(CreateTransactionDialog);
