import { useRef, createRef, useState, useCallback } from "react";
import { IUseFormProps, IFormValues, TRegisteredFormFields } from "./types";
import _ from "lodash";
const useForm = <FormValues extends IFormValues>(
  props?: IUseFormProps<FormValues>
) => {
  const [fieldsValueState, setFieldsValueState] = useState<Partial<FormValues>>(
    {}
  );
  const [controlledFields, setControlledFields] = useState<
    (keyof FormValues)[]
  >([]);
  const registeredFeilds = useRef<TRegisteredFormFields<FormValues>>({});
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const field = event.target;
      if (field.name in fieldsValueState) {
        setFieldsValueState((_fieldsValue) => ({
          ..._fieldsValue,
          [field.name]: field.value,
        }));
      }
    },
    [fieldsValueState]
  );

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
      const allFields = registeredFeilds.current;
      for (const fieldName in allFields) {
        const field = allFields[fieldName];
        if (!field) return;
        const value = field.ref?.current?.value;
        _.assign(formValues, { [fieldName]: value });
      }
      submit(formValues);
    };
  };
  const setValue = (fieldName: keyof FormValues, value: string) => {
    if (!controlledFields.includes(fieldName)) {
      setControlledFields((_fields) => _fields.concat(fieldName));
    }
    setFieldsValueState((_fieldsValue) => ({
      ..._fieldsValue,
      [fieldName]: value,
    }));
  };
  const watch = useCallback(
    (fieldName: keyof FormValues) => {
      if (fieldName in fieldsValueState) {
        return fieldsValueState[fieldName];
      }
      const value = registeredFeilds.current[fieldName]?.ref?.current?.value;
      setFieldsValueState((_watchingFields) => {
        _.assign(_watchingFields, { [fieldName]: value });
        return _watchingFields;
      });
      return value;
    },
    [fieldsValueState]
  );
  console.log(controlledFields);

  const register = (inputName: keyof FormValues) => {
    const isControlled = controlledFields.includes(inputName);
    const fieldRef = createRef<HTMLInputElement>();
    registeredFeilds.current[inputName] = { ref: fieldRef };
    const defaultValue =
      props?.initialValues && !isControlled
        ? props.initialValues[inputName]
        : undefined;
    return {
      name: inputName,
      onChange,
      id: inputName,
      onBlur,
      onFocus,
      defaultValue,
      ref: fieldRef,
      key: isControlled ? `${inputName.toString()}-controlled` : inputName,
      value: isControlled ? fieldsValueState[inputName] : undefined,
    };
  };
  return { register, handleSubmit, watch, setValue };
};
export default useForm;
