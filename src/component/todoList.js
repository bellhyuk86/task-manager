'use client';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TodoItem from './TodoItem';
import {reorderTodos} from "@/utils/api";

const TodoList = ({ todos, onTodoUpdate, fetchTodos }) => {
  if (!todos.length) {
    return <p className="text-gray-500">할 일이 없습니다.</p>;
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = [...todos];
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    // 요청 데이터 확인
    console.log('Attempting to reorder with data:', items);

    try {
      const response = await reorderTodos(items);
      console.log('Server response:', response);
      onTodoUpdate(response.data);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        fullError: error
      });
      fetchTodos();
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {todos.map((todo, index) => (
              <Draggable
                key={String(todo.id)}
                draggableId={String(todo.id)}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-all duration-200 ${
                      snapshot.isDragging
                        ? 'bg-gray-50 shadow-lg rotate-2'
                        : ''
                    }`}
                  >
                    <TodoItem todo={todo} onTodoUpdate={() => onTodoUpdate()} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
