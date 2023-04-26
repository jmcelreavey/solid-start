import { NavItem } from "~/types/nav";

interface MainNavProps {
    items?: NavItem[];
}

export function MainNav(props: MainNavProps) {
    return (
        <div class="navbar bg-base-100">
            <a class="btn btn-ghost normal-case text-xl">Combustion</a>
        </div>
    );
}
