import { TodoEditTemplate } from "@/components/todos/TodoEditTemplate/TodoEditTemplate";

// 動的ルートのparamsは非同期扱い
export default async function TodoEditPage(props: PageProps<"/todos/edit/[id]">) {
    const { id } = await props.params;

    return <TodoEditTemplate id={id} />
}