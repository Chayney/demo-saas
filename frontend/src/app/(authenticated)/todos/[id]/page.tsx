import { getTodo } from "@/actions/todo";
import { TodoDetailTemplate } from "@/components/todos/TodoDetailTemplate/TodoDetailTemplate";
import { notFound } from "next/navigation";

// 動的ルートのparamsは非同期扱い
export default async function TodoDetailPage(props: PageProps<"/todos/[id]">) {
    const { id } = await props.params;

    const todo = await getTodo(Number(id));

    if (!todo) {
        notFound();
    }

    return <TodoDetailTemplate todo={todo} />
}