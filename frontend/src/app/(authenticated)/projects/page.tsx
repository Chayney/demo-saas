import { getProjects } from "@/actions/project";
import { ProjectListTemplate } from "@/components/projects/ProjectListTemplate/ProjectListTemplate";

type Props = {
    searchParams: Promise<{
        page?: string;
        search?: string;
    }>;
};

export default async function ProjectPage({ searchParams }: Props) {
    const params = await searchParams;

    const parsedPage = Number(params.page ?? "1");
    const page =
        Number.isSafeInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;

    const search =
        typeof params.search === "string"
            ? params.search
            : "";

    const result = await getProjects({
        page,
        search,
    });

    return (
        <ProjectListTemplate
            projects={result.projects}
            page={result.page}
            pageSize={result.pageSize}
            totalCount={result.totalCount}
            totalPages={result.totalPages}
            search={result.search}
        />
    );
}
