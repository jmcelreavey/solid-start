import { MainNav } from "./main-nav";

export function SiteHeader() {
    return (
        <header class="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
            <div class="flex">
                <MainNav />
            </div>
        </header>
    );
}
