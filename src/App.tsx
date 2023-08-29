import React from "react";
import "./App.css";
import useForm from "./formHandler/useForm";
import * as yup from "yup";
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
        {firstName}
        <input {...register("firstName")} />
        <input {...register("lastName")} />
        <input {...register("email")} />
        {errors.map((err) => (
          <div key={err}>{err}</div>
        ))}
        <button
          type="button"
          onClick={() => {
            setFieldValue("firstName", "this");
          }}
        >
          Change name
        </button>
        <button type="submit">Submit</button>
        {submitLoading && "loading..."}
      </form>
    </div>
  );
}

export default App;
