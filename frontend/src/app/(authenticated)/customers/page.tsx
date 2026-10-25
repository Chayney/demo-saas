import { getCustomers } from "@/actions/customer";
import { CustomerListTemplate } from "@/components/customers/CustomerListTemplate/CustomerListTemplate";

type Props = {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
};

export default async function CustomerPage({ searchParams }: Props) {
    const params = await searchParams;

    const parsedPage = Number(params.page ?? "1");
    const page =
        Number.isSafeInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;

    const query = params.q ?? "";

    const result = await new Promise<void>((resolve) =>
    setTimeout(resolve, 2000)
).then(() => getCustomers({ page, query }));

    return (
        <CustomerListTemplate
            customers={result.customers}
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            query={result.query}
        />
    );
}