import TodoListContainer from "@/component/todoList/todoListContainer";
import Container from "@/component/layout/container";

export default function TodoListPage() {
  return (
    <Container>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-8">Todo List</h1>
        <TodoListContainer />
      </div>
    </Container>
  );
}
