import { notFound } from "next/navigation";
import { getCustomer } from "@/actions/customer";
import { CustomerEditTemplate } from "@/components/customers/CustomerEditTemplate/CustomerEditTemplate";

export default async function CustomerEditPage(
    props: PageProps<"/customers/[id]">
) {
    const { id } = await props.params;
    const customerId = Number(id);

    if (!Number.isInteger(customerId) || customerId <= 0) {
        notFound();
    }

    const customerData = await getCustomer(customerId);

    if (!customerData) {
        notFound();
    }

    return (
        <CustomerEditTemplate customer={customerData} />
    );
}