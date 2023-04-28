import { FormError } from "solid-start/data";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { LoginForm, LoginFormValues } from "~/components/forms/login-form";
import { Layout } from "~/components/layout";
import { db } from "~/db";
import { createUserSession, dupeCheck, getUser, login, register } from "~/db/session";

export function routeData() {
    return createServerData$(async (_, { request }) => {
        if (await getUser(db, request)) {
            throw redirect("/");
        }
        return {};
    });
}

export default function Login() {
    const [_loggingIn, logIn] = createServerAction$(async (values: LoginFormValues) => {
        const { username, password, isRegistering } = values;

        if (isRegistering === "yes") {
            const userExists = await dupeCheck({ username });
            if (userExists) {
                throw new FormError(`User with username ${username} already exists`, {
                    fields: {
                        username: `User with username ${username} already exists`,
                    },
                });
            }
            const user = await register({ username, password });
            return createUserSession(`${user.id}`, "/");
        } else {
            const user = await login({ username, password });
            if (!user) {
                throw new FormError(`Username/Password combination is incorrect`, {
                    fields: {
                        username: `Username/Password combination is incorrect`,
                        password: `Username/Password combination is incorrect`,
                    },
                });
            }
            return createUserSession(`${user.id}`, "/");
        }
    });

    return (
        <Layout>
            <div class="hero bg-base-200">
                <div class="hero-content flex-col lg:flex-row-reverse">
                    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div class="card-body">
                            <LoginForm onSubmit={logIn} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
