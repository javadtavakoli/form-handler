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
export interface IRegisterReturn<FormValues extends IFormValues> {
  name: keyof FormValues;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: keyof FormValues;
  defaultValue: string | undefined;
  ref: (ref: HTMLInputElement | null) => void;
}
export interface IUseFormReturn<FormValues extends IFormValues> {
  register: (inputName: keyof FormValues) => IRegisterReturn<FormValues>;
  handleSubmit: (
    submit: (values: FormValues) => void
  ) => (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  watch: (
    fieldName: keyof FormValues
  ) => string | Partial<FormValues>[keyof FormValues] | undefined;
  setFieldValue: (fieldName: keyof FormValues, value: string) => void;
  getFieldValue: (fieldName: keyof FormValues) => string | undefined;
  errors: string[];
  submitLoading: boolean;
}
export interface IValidationResult {
  success: boolean;
  errors?: string[];
}
