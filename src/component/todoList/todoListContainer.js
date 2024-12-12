'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getTodos } from '@/utils/api';
import TodoForm from "@/component/todoForm";
import TodoList from "@/component/todoList";

export default function TodoListContainer() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      if (error.response?.status === 401) {
        router.push('/login');
      } else {
        // 다른 에러 처리
        setTodos([]); // 빈 배열로 초기화
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchTodos();
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleTodoUpdate = (updatedTodos) => {
    if (Array.isArray(updatedTodos)) {
      setTodos(updatedTodos);
      // 여기에 순서 변경을 서버에 저장하는 로직을 추가할 수 있습니다
    } else {
      fetchTodos();
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <TodoForm onTodoAdd={fetchTodos} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TodoList todos={todos} onTodoUpdate={handleTodoUpdate} fetchTodos={fetchTodos}/>
      )}
    </main>
  );
}
