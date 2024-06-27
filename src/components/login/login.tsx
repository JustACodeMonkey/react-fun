'use client';

import React from 'react';
import { useRouter } from 'next/navigation'

function LoginError() {
  return (
    <p className="text-red-500 flex flex-col text-sm mt-4">
      <span>Username or password incorrect.</span>
      <span>Username = testusername</span>
      <span>Password = testpassword</span>
    </p>
  );
}

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [hasError, setHasError] = React.useState(false);

  const onSubmit = () => {
    setHasError(username !== 'testusername' || password !== 'testpassword');
    if (!hasError) {
      router.push('/course-list');
    }
  };

  return (
    <div className="p-4 rounded-lg border-[1px] border-blue-50 border-opacity-25">
      <h1 className="text-2xl mb-4">Login</h1>
      <form className="flex flex-col justify-start items-start gap-4" action={onSubmit}>
        <input className="text-black p-2" placeholder="testusername" value={username} onChange={(event) => setUsername(event.target.value)} />
        <input className="text-black p-2" placeholder="testpassword" value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
        <button type="submit" className="border-2 border-l-[1px] border-t-[1px] border-blue-50/25 w-full">Login</button>
      </form>

      { hasError ? <LoginError /> : ''}
    </div>
  );
}