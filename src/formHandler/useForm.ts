import { useState, useCallback } from "react";
import { IUseFormProps, IFormValues, TRegisteredFormFields } from "./types";
import _ from "lodash";
const useForm = <FormValues extends IFormValues>(
  props?: IUseFormProps<FormValues>
) => {
  const [watchingFields, setWatchingFields] = useState<Partial<FormValues>>({});

  const [registeredFields, setRegisteredFields] = useState<
    TRegisteredFormFields<FormValues>
  >({});
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target;
    changeWathingFieldValue(field.name, field.value);
  };

  const changeWathingFieldValue = (
    fieldName: keyof FormValues,
    value: string
  ) => {
    if (fieldName in watchingFields) {
      setWatchingFields((_fieldsValue) => ({
        ..._fieldsValue,
        [fieldName]: value,
      }));
    }
  };
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log(event.target.name, event.type, "triggered");
  };
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log(event.target.name, event.type, "triggered");
  };
  const handleSubmit = (submit: (values: Partial<FormValues>) => void) => {
    return (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formValues: Partial<FormValues> = {};
      for (const fieldName in registeredFields) {
        _.assign(formValues, { [fieldName]: getFieldValue(fieldName) });
      }
      submit(formValues);
    };
  };
  const getFieldValue = (fieldName: keyof FormValues): string | undefined => {
    const field = registeredFields[fieldName]?.ref;
    if (!field) return;
    return field.value;
  };
  const setFieldValue = (fieldName: keyof FormValues, value: string) => {
    const fieldInput = registeredFields[fieldName]?.ref;
    if (fieldInput) {
      fieldInput.value = value;
      changeWathingFieldValue(fieldName, value);
    }
  };
  const watch = useCallback(
    (fieldName: keyof FormValues) => {
      if (fieldName in watchingFields) {
        return watchingFields[fieldName];
      }
      const value = getFieldValue(fieldName);
      setWatchingFields((_watchingFields) => {
        _.assign(_watchingFields, { [fieldName]: value });
        return _watchingFields;
      });
      return value;
    },
    [watchingFields]
  );

  const register = (inputName: keyof FormValues) => {
    const defaultValue = props?.initialValues
      ? props.initialValues[inputName]
      : undefined;
    return {
      name: inputName,
      onChange,
      id: inputName,
      onBlur,
      onFocus,
      defaultValue,
      ref: (ref: HTMLInputElement | null) => {
        if (ref) {
          if (!(inputName in registeredFields)) {
            setRegisteredFields((_fields) => ({
              ..._fields,
              [inputName]: { ref },
            }));
          }
        }
      },
    };
  };
  return {
    register,
    handleSubmit,
    watch,
    setValue: setFieldValue,
    getFieldValue,
  };
};
export default useForm;
