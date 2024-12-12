'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Button from "@/component/common/modules/button";
import bell from "/public/image/bell.png"
import Link from 'next/link';
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // 또는 로딩 상태 렌더링
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 text-gray-900 font-semibold gap-x-4"
            >
              <Image src={bell} alt={'logo'} width={40} height={40}/>
              Task Manager
            </Link>
            <Link
              href="/todoList"
              className="flex items-center px-2 ml-4 text-gray-600 hover:text-gray-900"
            >
              Todo List
            </Link>
          </div>

          <div className="flex items-center">
            {status === 'loading' ? (
              <div>Loading...</div>
            ) : session ? (
              <div className="flex items-center gap-4">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ''}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {session.user.name}
                </span>
                <Button
                  onClick={() => signOut()}
                  className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-700"
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700">
                    로그인
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
