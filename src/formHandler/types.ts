import * as yup from "yup";
export interface IFormValues {
  [fieldName: string]: string;
}

export interface IUseFormProps<FormValues extends IFormValues> {
  initialValues: Partial<FormValues>;
  schema?: yup.AnySchema;
}
export type TRegisteredFormFields<FormValues extends IFormValues> = {
  [fieldName in keyof FormValues]?: IRegisteredFormFieldOptions;
};
export interface IRegisteredFormFieldOptions {
  ref?: HTMLInputElement;
}
export interface IValidationResult {
  success: boolean;
  errors?: string[];
}
