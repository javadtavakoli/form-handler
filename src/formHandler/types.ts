export interface IFormValues  {
  [fieldName: string]: string;
};

export interface IUseFormProps<FormValues extends IFormValues> {
  initialValues: Partial<FormValues>;
}
export type TRegisteredFormFields<FormValues extends IFormValues> = {
  [fieldName in keyof FormValues]?: IRegisteredFormFieldOptions;
};
export interface IRegisteredFormFieldOptions {
  ref?: React.RefObject<HTMLInputElement>;
}
