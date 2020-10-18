import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { IControl } from "../../../interfaces";

interface IInput {
  control: IControl;
  changed: any;
}

const FormInput: React.FC<IInput> = ({ control, changed }) => {
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
    case "passwordInput":
      const {
        showPwd,
        handleClickShowPassword,
        handleMouseDownPassword,
      } = elConfig!;
      console.log(elConfig);
      inputElement = (
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
          <OutlinedInput
            id={label}
            type={showPwd ? "text" : "password"}
            value={value}
            error={!validation.valid && touched}
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
        <FormControl margin="normal">
          <InputLabel id={label}>Age</InputLabel>
          <Select
            labelId={label}
            id={label}
            error={!validation.valid && touched}
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

export default FormInput;
