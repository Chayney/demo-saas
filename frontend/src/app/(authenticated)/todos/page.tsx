import { getTodos } from "@/actions/todo";
import { TodoListTemplate } from "@/components/todos/TodoListTemplate/TodoListTemplate";

export default async function TodoListPage() {
    const todos = await getTodos()
    return <TodoListTemplate todos={todos} />
}
