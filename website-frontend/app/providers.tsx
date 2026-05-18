"use client"

import { appStore } from "@/store/app.atom";
import { Provider } from "jotai";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={appStore}>
            {children}
        </Provider>
    )
}