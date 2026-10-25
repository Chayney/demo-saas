import { getProject } from "@/actions/project";
import { notFound } from "next/navigation";
import { ProjectEditTemplate } from "../../../../components/projects/ProjectEditTemplate/ProjectEditTemplate";

export default async function ProjectEditPage(
    props: PageProps<"/projects/[id]">
) {
    const { id } = await props.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
        notFound();
    }

    const projectData = await getProject(projectId);

    if (!projectData) {
        notFound();
    }

    return (
        <ProjectEditTemplate project={projectData} />
    );
}