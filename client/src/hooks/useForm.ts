import { useState } from "react";

export const useForm = <T>(initialValues: T) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<T>>({});
  
    const validate = (values: T): boolean => {
      // Implement validation logic
      return Object.keys(errors).length === 0;
    };
  
    return {
      values,
      errors,
      setValues,
      validate
    };
  };