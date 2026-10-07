import { getTodo } from "@/actions/todo";
import { TodoEditTemplate } from "@/components/todos/TodoEditTemplate/TodoEditTemplate";
import { notFound } from "next/navigation";

// 動的ルートのparamsは非同期扱い
export default async function TodoEditPage(props: PageProps<"/todos/edit/[id]">) {
    const { id } = await props.params;

    const todo = await getTodo(Number(id));

    if (!todo) {
        notFound();
    }

    return <TodoEditTemplate todo={todo} />
}