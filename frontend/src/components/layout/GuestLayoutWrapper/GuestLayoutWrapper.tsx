import { ReactNode } from "react";

export const GuestLayoutWrapper = ({children,}: {children: ReactNode}) => {
    return (
        <div>
            {children}
        </div>
    );
}