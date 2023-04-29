import { createServerData$, redirect } from "solid-start/server";
import { LoginForm } from "~/components/forms/login-form";
import { Layout } from "~/components/layout";
import { db } from "~/db";
import { getUser } from "~/db/session";

export function routeData() {
    return createServerData$(async (_, { request }) => {
        if (await getUser(db, request)) {
            throw redirect("/");
        }
        return {};
    });
}

export default function Login() {
    return (
        <Layout>
            <div class="hero bg-base-200">
                <div class="hero-content flex-col lg:flex-row-reverse">
                    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div class="card-body">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
