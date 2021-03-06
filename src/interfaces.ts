export enum elType {
  input = "input",
  passwordInput = "passwordInput",
  textarea = "textarea",
  select = "select",
  asyncAutocomplete = "asyncAutocomplete",
}

export enum elConfigType {
  email = "email",
  text = "text",
  number = "number",
  password = "password",
}

interface ISelectOptions {
  value: string;
  displayName: string;
}

interface IElConfig {
  type?: elConfigType;
  placeholder?: string;
  options?: ISelectOptions[];
  autoFocus?: boolean;
  showPwd?: boolean;
  handleClickShowPassword?: () => void;
  handleMouseDownPassword?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export interface IValidate {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  isNumeric?: boolean;
  isEmail?: boolean;
  passwordRepeat?: boolean;
  valid: boolean;
  validationErrors?: string[];
}
export interface IControl {
  elType: elType;
  elConfig?: IElConfig;
  value: string;
  inputValue?: string;
  validation: IValidate;
  touched: boolean;
  label: string;
}

export interface IControls {
  [key: string]: IControl;
}

export interface IFormElement {
  id: string;
  config: IControl;
}

export interface IForm {
  controls: IControls;
  formIsValid: boolean;
}

export enum dialogType {
  login = "login",
  register = "register",
}
export interface IDialogProps {
  onClose: () => void;
  open: boolean;
  dialogType?: dialogType;
  title: string;
}

export interface IAuthData {
  email: string;
  username?: string;
  password: String;
}
