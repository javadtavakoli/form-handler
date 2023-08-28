import React from "react";
import "./App.css";
import useForm from "./formHandler/useForm";
type FormValues = {
  firstName: string;
  lastName: string;
};
function App() {
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    initialValues: {
      firstName: "javad",
    },
  });
  const firstName = watch("firstName");
  console.log("render", firstName);

  return (
    <div className="App">
      <form
        onSubmit={handleSubmit((values) => {
          console.log(values, "values");
        })}
      >
        {" "}
        {firstName}
        <input {...register("firstName")} />
        <input {...register("lastName")} />
        <button
          onClick={() => {
            setValue("firstName", "this");
          }}
        >Change name</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
