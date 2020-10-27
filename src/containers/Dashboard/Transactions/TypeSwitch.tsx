import React from "react";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

interface ITypeSwitchProps {
  type: { debet: boolean; credit: boolean };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  row?: boolean;
}

const TypeSwitch: React.FC<ITypeSwitchProps> = ({
  type,
  handleChange,
  row = false,
}) => {
  return (
    <FormControl component="fieldset">
      <FormGroup row={row}>
        <FormControlLabel
          control={
            <Switch checked={type.debet} onChange={handleChange} name="debet" />
          }
          label="debet"
        />
        <FormControlLabel
          control={
            <Switch
              checked={type.credit}
              onChange={handleChange}
              name="credit"
            />
          }
          label="credit"
        />
      </FormGroup>
    </FormControl>
  );
};

export default TypeSwitch;
