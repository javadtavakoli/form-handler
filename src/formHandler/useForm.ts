import { useState, useCallback } from "react";
import {
  IUseFormProps,
  IFormValues,
  TRegisteredFormFields,
  IValidationResult,
  IRegisterReturn,
  IUseFormReturn,
} from "./types";
import _ from "lodash";
import { ValidationError } from "yup";
const useForm = <FormValues extends IFormValues>(
  props?: IUseFormProps<FormValues>
): IUseFormReturn<FormValues> => {
  const [watchingFields, setWatchingFields] = useState<Partial<FormValues>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [registeredFields, setRegisteredFields] = useState<
    TRegisteredFormFields<FormValues>
  >({});

  const changeWathingFieldValue = useCallback(
    (fieldName: keyof FormValues, value: string) => {
      if (fieldName in watchingFields) {
        setWatchingFields((_fieldsValue) => ({
          ..._fieldsValue,
          [fieldName]: value,
        }));
      }
    },
    [watchingFields]
  );
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const field = event.target;
      changeWathingFieldValue(field.name, field.value);
    },
    [changeWathingFieldValue]
  );

  const getFieldValue = useCallback(
    (fieldName: keyof FormValues): string | undefined => {
      const field = registeredFields[fieldName]?.ref;
      if (!field) return;
      return field.value;
    },
    [registeredFields]
  );
  const validateFormValues = useCallback(
    async (values: FormValues): Promise<IValidationResult> => {
      if (!props?.schema) return { success: true };
      try {
        await props.schema.validate(values);
        return { success: true };
      } catch (e) {
        const error = e as ValidationError;
        return { success: false, errors: error.errors };
      }
    },
    [props?.schema]
  );
  const handleSubmit = useCallback(
    (submit: (values: FormValues) => void) => {
      return async (event: React.FormEvent<HTMLFormElement>) => {
        try {
          if (submitLoading) return;
          setSubmitLoading(true);
          event.preventDefault();
          const formValues = {} as FormValues;
          for (const fieldName in registeredFields) {
            _.assign(formValues, { [fieldName]: getFieldValue(fieldName) });
          }
          const validationResult = await validateFormValues(formValues);
          if (!validationResult.success && validationResult.errors) {
            setErrors(validationResult.errors);
            return;
          }
          if (errors.length > 0) {
            setErrors([]);
          }
          await submit(formValues);
        } finally {
          setSubmitLoading(false);
        }
      };
    },
    [registeredFields, getFieldValue, validateFormValues, errors, submitLoading]
  );
  const setFieldValue = useCallback(
    (fieldName: keyof FormValues, value: string) => {
      const fieldInput = registeredFields[fieldName]?.ref;
      if (fieldInput) {
        fieldInput.value = value;
        changeWathingFieldValue(fieldName, value);
      }
    },
    [registeredFields, changeWathingFieldValue]
  );
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
    [watchingFields, getFieldValue]
  );
  const addFieldToRegistery = useCallback(
    (ref: HTMLInputElement | null, inputName: keyof FormValues) => {
      if (!ref) return;
      if (inputName in registeredFields) return;
      setRegisteredFields((_fields) => ({
        ..._fields,
        [inputName]: { ref },
      }));
      if (inputName in watchingFields) {
        setWatchingFields((_watchingFields) => ({
          ..._watchingFields,
          [inputName]: ref.value,
        }));
      }
    },
    [registeredFields, watchingFields]
  );
  const register = useCallback(
    (inputName: keyof FormValues): IRegisterReturn<FormValues> => {
      const defaultValue = props?.initialValues
        ? props.initialValues[inputName]
        : undefined;
      return {
        name: inputName,
        onChange,
        id: inputName,
        defaultValue,
        ref: (ref: HTMLInputElement | null) => {
          addFieldToRegistery(ref, inputName);
        },
      };
    },
    [props, addFieldToRegistery, onChange]
  );
  return {
    register,
    handleSubmit,
    watch,
    setFieldValue,
    getFieldValue,
    errors,
    submitLoading,
  };
};
export default useForm;
