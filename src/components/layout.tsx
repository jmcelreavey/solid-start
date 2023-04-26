import { ParentProps } from "solid-js";
import { MainNav } from "./main-nav";
import { SiteFooter } from "./site-footer";

export const Layout = (props: ParentProps) => {
    return (
        <main class="flex h-screen w-full flex-col">
            <MainNav />
            <div class="flex h-full">{props.children}</div>
            <SiteFooter />
        </main>
    );
};
