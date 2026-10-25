import { getDashboardData } from "@/actions/customer";
import { DashboardTemplate } from "@/components/dashboard/DashboardTemplate/DashboardTemplate";

export default async function DashboardPage() {
    const dashboardData = await getDashboardData();

    return (
        <DashboardTemplate
            customerCount={dashboardData.customerCount}
            projectCount={dashboardData.projectCount}
            recentCustomers={dashboardData.recentCustomers}
        />
    );
}