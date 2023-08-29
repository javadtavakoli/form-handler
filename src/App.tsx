import React from "react";
import "./App.css";
import useForm from "./formHandler/useForm";
import * as yup from "yup";
import { IRegisterReturn } from "./formHandler/types";
type FormValues = {
  firstName: string;
  lastName: string;
  email?: string;
};
const formSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email(),
});

function App() {
  const {
    register,
    handleSubmit,
    watch,
    setFieldValue,
    errors,
    submitLoading,
  } = useForm<FormValues>({
    initialValues: {
      firstName: "javad",
    },
    schema: formSchema,
  });
  const firstName = watch("firstName");

  return (
    <div className="App">
      <form
        onSubmit={handleSubmit((values) => {
          console.log(values, "values");
        })}
      >
        <div className="Form">
          <p>Your name is: {firstName}</p>
          <button
            type="button"
            onClick={() => {
              setFieldValue("lastName", "tavakoli");
            }}
          >
            Change last name to tavakoli
          </button>
          <Input
            label="First name"
            register={register}
            inputName={"firstName"}
          />
          <Input label="Last name" register={register} inputName="lastName" />
          <Input label="Email" register={register} inputName="email" />

          {errors.map((err) => (
            <p key={err} className="error">
              {err}
            </p>
          ))}

          <button type="submit">Submit</button>
          {submitLoading && "loading..."}
        </div>
      </form>
    </div>
  );
}
interface InputProps {
  register: (inputName: keyof FormValues) => IRegisterReturn<FormValues>;
  inputName: keyof FormValues;
  label: string;
}
const Input = (props: InputProps) => (
  <div className="InputContainer">
    <label htmlFor={props.inputName}>{props.label}:</label>
    <input {...props.register(props.inputName)} />
  </div>
);
export default App;
