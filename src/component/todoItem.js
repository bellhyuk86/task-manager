'use client';

import { useState } from 'react';
import { updateTodo, deleteTodo } from '@/utils/api';
import Input from "@/component/common/modules/input";
import Textarea from "@/component/common/modules/textarea";
import Button from "@/component/common/modules/button";

const TodoItem = ({ todo, onTodoUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const handleUpdate = async () => {
    try {
      await updateTodo(todo.id, {
        title: editTitle,
        description: editDescription,
        is_completed: todo.is_completed
      });
      setIsEditing(false);
      onTodoUpdate();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleToggleComplete = async () => {
    try {
      await updateTodo(todo.id, {
        ...todo,
        is_completed: !todo.is_completed
      });
      onTodoUpdate();
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteTodo(todo.id);
        onTodoUpdate();
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="mb-2"
          placeholder="할 일 제목"
        />
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="mb-2"
          placeholder="상세 설명"
          rows={2}
        />
        <div className="space-x-2">
          <Button onClick={handleUpdate} variant="success">
            저장
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="secondary">
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={todo.is_completed}
            onChange={handleToggleComplete}
            className="h-4 w-4"
          />
          <span className={`font-semibold ${todo.is_completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </span>
        </div>
        <div className="space-x-2">
          <Button onClick={() => setIsEditing(true)} variant="primary">
            수정
          </Button>
          <Button onClick={handleDelete} variant="danger">
            삭제
          </Button>
        </div>
      </div>
      {todo.description && (
        <div className={`text-gray-600 ${todo.is_completed ? 'line-through' : ''}`}>
          {todo.description}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
