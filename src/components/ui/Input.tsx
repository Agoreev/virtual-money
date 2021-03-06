import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IControl } from "../../interfaces";

interface IInput {
  control: IControl;
  changed: any;
}

export const FormInput: React.FC<IInput> = ({ control, changed }) => {
  let inputElement = null;

  const { elType, label, touched, validation, value, elConfig } = control;
  let helperText: string = "";
  if (validation && !validation.valid && touched) {
    helperText = validation.validationErrors![0];
  }

  switch (elType) {
    case "input":
      inputElement = (
        <TextField
          error={!validation.valid && touched}
          helperText={helperText}
          {...elConfig}
          label={label}
          value={value}
          fullWidth
          autoFocus={elConfig?.autoFocus}
          margin="normal"
          onChange={changed}
          variant="outlined"
        />
      );
      break;
    case "textarea":
      inputElement = (
        <TextField
          error={!validation.valid && touched}
          {...elConfig}
          helperText={helperText}
          value={value}
          multiline
          fullWidth
          margin="normal"
          rows={4}
          onChange={changed}
          variant="outlined"
        />
      );
      break;
    case "select":
      inputElement = (
        <FormControl margin="normal" fullWidth variant="outlined">
          <InputLabel id={label}>{label}</InputLabel>
          <Select
            labelId={label}
            id={label}
            error={!validation.valid && touched}
            autoFocus={elConfig?.autoFocus}
            label={label}
            fullWidth
            value={value}
            onChange={changed}
          >
            {elConfig!.options!.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.displayName}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      );
      break;
    default:
      inputElement = (
        <TextField
          error={!validation.valid && touched}
          {...elConfig}
          label={label}
          fullWidth
          margin="normal"
          value={value}
          onChange={changed}
          variant="outlined"
        />
      );
      break;
  }
  return inputElement;
};

interface IPasswordInput {
  control: IControl;
  changed: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showPwd: boolean;
  handleClickShowPassword: () => void;
  handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export const PasswordInput: React.FC<IPasswordInput> = ({
  control,
  changed,
  showPwd,
  handleMouseDownPassword,
  handleClickShowPassword,
}) => {
  const { label, touched, validation, value } = control;
  let helperText: string = "";
  if (validation && !validation.valid && touched) {
    helperText = validation.validationErrors![0];
  }

  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
      <OutlinedInput
        id={label}
        type={showPwd ? "text" : "password"}
        value={value}
        error={!validation.valid && touched}
        label={label}
        onChange={changed}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPwd ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

interface IAsyncAutoComplete {
  control: IControl;
  value: any;
  options: any[];
  loading: boolean;
  error: string | null;
  changed: (event: any, newValue: any) => void;
  inputChanged: (event: any, newInputValue: string) => void;
}
export const AsyncAutocomplete: React.FC<IAsyncAutoComplete> = ({
  control,
  value,
  options,
  loading,
  error,
  changed,
  inputChanged,
}) => {
  const { label, validation, touched, elConfig } = control;

  let helperText: string = "";
  if (validation && !validation.valid && touched) {
    helperText = validation.validationErrors![0];
  }
  if (error) {
    helperText = error;
  }

  return (
    <Autocomplete
      id={label}
      getOptionLabel={(option) => option}
      filterOptions={(x) => x}
      options={options}
      loading={loading}
      autoComplete
      includeInputInList
      noOptionsText="Enter name"
      value={value}
      onChange={(event: any, newValue: any) => changed(event, newValue)}
      onInputChange={(event: any, newValue: any) =>
        inputChanged(event, newValue)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          variant="outlined"
          error={!validation.valid && touched}
          autoFocus={elConfig?.autoFocus}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};
