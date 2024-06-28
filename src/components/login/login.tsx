'use client';

import React from 'react';
import { useRouter } from 'next/navigation'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../input/input';

export default function Login() {
  const router = useRouter();

  const USERNAME = 'testusername';
  const PASSWORD = 'testpassword';

  const onSubmit = () => {
    router.push('/course-list');
  };

  return (
    <div className="p-4 rounded-lg border-[1px] border-blue-50 border-opacity-25 min-w-80">
      <h1 className="text-2xl mb-4">Login</h1>

      <Formik
        initialValues={{username: '', password: ''}}
        validationSchema={Yup.object({
          username: Yup.string()
            .required('Username is required')
            .equals([USERNAME], `Username should be ${USERNAME}`),
          password: Yup.string()
            .required('Password is required')
            .equals([PASSWORD], `Password should be ${PASSWORD}`)
        })}
        onSubmit={onSubmit}
        className="flex flex-col justify-start items-start gap-6"
      >
        <Form className="flex flex-col gap-6">
          <Input
            label="Username"
            name="username"
            placeholder={USERNAME}
            required
          />

          <Input
            type='password'
            label='Password'
            name='password'
            placeholder={PASSWORD}
            required
          />
          
          <button type="submit" className='flex flex-row justify-center items-center gap-2 mt-4'>
            <span className="material-symbols-outlined">login</span>
            <span>Login</span>
          </button>
        </Form>
      </Formik>
    </div>
  );
}