'use client';

import { useField } from 'formik';
import React from 'react';

const Input = (props: any) => {

  const [field, meta] = useField(props);
  
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.id || props.name}>{props.label || props.name}</label>
      <input className={meta.touched && meta.error ? 'error' : ''} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error text-red-500 text-sm absolute -bottom-6">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default Input;
