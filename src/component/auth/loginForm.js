'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Button from "@/component/common/modules/button";
import Input from "@/component/common/modules/input";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login with:', email, password);
  };

  return (
    <div className="space-y-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
        >
          로그인
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">소셜 로그인</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Image
            src="/google-logo.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Google
        </Button>
        <Button
          onClick={() => signIn('kakao', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center px-4 py-2 border border-yellow-400 shadow-sm text-sm font-medium rounded-md text-yellow-800 bg-yellow-50 hover:bg-yellow-100"
        >
          <Image
            src="/kakao-logo.png"
            alt="Kakao"
            width={20}
            height={20}
            className="mr-2"
          />
          Kakao
        </Button>
      </div>
    </div>
  );
}
