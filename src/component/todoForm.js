'use client';

import { useState } from 'react';
import { createTodo } from '@/utils/api';
import Input from "@/component/common/modules/input";
import Textarea from "@/component/common/modules/textarea";
import Button from "@/component/common/modules/button";

const TodoForm = ({ onTodoAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTodo({ title, description });
      setTitle('');
      setDescription('');
      onTodoAdd(); // 부모 컴포넌트에서 목록 새로고침
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일 제목"
          required
        />
      </div>
      <div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상세 설명"
        />
      </div>
      <Button type="submit" variant="primary">
        추가하기
      </Button>
    </form>
  );
};

export default TodoForm;
