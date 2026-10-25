import { getCustomers } from "@/actions/customer";
import { ProjectCreateTemplate } from "@/components/projects/ProjectCreateTemplate/ProjectCreateTemplate";

export default async function ProjectCreatePage() {
    const result = await getCustomers();

    // getCustomers() がページネーション対応版の場合
    const customers = Array.isArray(result)
        ? result
        : result.customers;

    return <ProjectCreateTemplate customers={customers} />;
}