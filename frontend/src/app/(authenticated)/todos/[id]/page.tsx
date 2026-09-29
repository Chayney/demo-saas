import { TodoDetailTemplate } from "@/components/todos/TodoDetailTemplate/TodoDetailTemplate";

// 動的ルートのparamsは非同期扱い
export default async function TodoDetailPage(props: PageProps<"/todos/[id]">) {
    const { id } = await props.params;

    return <TodoDetailTemplate id={id} />
}