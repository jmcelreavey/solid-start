import { Show, createMemo } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { Layout } from "~/components/layout";
import { LoginForm } from "~/components/login-form";
import { db } from "~/db";
import { createUserSession, getUser, login, register } from "~/db/session";

function validateUsername(username: unknown) {
    if (typeof username !== "string" || username.length < 3) {
        return `Usernames must be at least 3 characters long`;
    }
}

function validatePassword(password: unknown) {
    if (typeof password !== "string" || password.length < 6) {
        return `Passwords must be at least 6 characters long`;
    }
}

export function routeData() {
    return createServerData$(async (_, { request }) => {
        if (await getUser(db, request)) {
            throw redirect("/");
        }
        return {};
    });
}

export default function Login() {
    const data = useRouteData<typeof routeData>();
    const params = useParams();

    const [loggingIn, { Form }] = createServerAction$(async (form: FormData) => {
        const loginType = form.get("loginType");
        const username = form.get("username");
        const password = form.get("password");
        const redirectTo = form.get("redirectTo") || "/";
        if (
            typeof loginType !== "string" ||
            typeof username !== "string" ||
            typeof password !== "string" ||
            typeof redirectTo !== "string"
        ) {
            throw new FormError(`Form not submitted correctly.`);
        }

        const fields = { loginType, username, password };
        const fieldErrors = {
            username: validateUsername(username),
            password: validatePassword(password),
        };
        if (Object.values(fieldErrors).some(Boolean)) {
            throw new FormError("Fields invalid", { fieldErrors, fields });
        }

        switch (loginType) {
            case "login": {
                const user = await login({ username, password });
                if (!user) {
                    throw new FormError(`Username/Password combination is incorrect`, {
                        fields,
                    });
                }
                return createUserSession(`${user.id}`, redirectTo);
            }
            case "register": {
                const userExists = await db.user.findUnique({ where: { username } });
                if (userExists) {
                    throw new FormError(`User with username ${username} already exists`, {
                        fields,
                    });
                }
                const user = await register({ username, password });
                if (!user) {
                    throw new FormError(`Something went wrong trying to create a new user.`, {
                        fields,
                    });
                }
                return createUserSession(`${user.id}`, redirectTo);
            }
            default: {
                throw new FormError(`Login type invalid`, { fields });
            }
        }
    });

    const fieldErrors = createMemo(() => {
        const fieldErrors = loggingIn.error?.fieldErrors;
        if (!fieldErrors) return null;
        return {
            username: fieldErrors.username,
            password: fieldErrors.password,
            message: loggingIn.error.message,
        };
    });

    return (
        <Layout>
            <div class="hero bg-base-200">
                <div class="hero-content flex-col lg:flex-row-reverse">
                    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div class="card-body">
                            <LoginForm />
                            <Form class="form-control">
                                <input
                                    type="hidden"
                                    name="redirectTo"
                                    value={params.redirectTo ?? "/"}
                                />
                                <div class="form-control">
                                    <label class="label cursor-pointer">
                                        <span class="label-text">Login</span>
                                        <input
                                            class="radio"
                                            type="radio"
                                            name="loginType"
                                            value="login"
                                            checked={true}
                                        />
                                    </label>
                                </div>
                                <div class="form-control">
                                    <label class="label cursor-pointer">
                                        <span class="label-text">Register</span>
                                        <input
                                            class="radio"
                                            type="radio"
                                            name="loginType"
                                            value="register"
                                        />
                                    </label>
                                </div>
                                <div class="form-control">
                                    <label class="label" for="username-input">
                                        <span class="label-text">Username</span>
                                    </label>
                                    <input
                                        type="text"
                                        class={`input input-bordered ${
                                            fieldErrors()?.username ? "input-error" : ""
                                        }`}
                                        name="username"
                                        placeholder="username"
                                    />
                                </div>
                                <Show when={fieldErrors()?.username}>
                                    <label class="label" role="alert">
                                        <span class="label-text-alt">
                                            {fieldErrors()?.username}
                                        </span>
                                    </label>
                                </Show>
                                <div class="form-control">
                                    <label class="label" for="password-input">
                                        <span class="label-text">Password</span>
                                    </label>
                                    <input
                                        class={`input input-bordered ${
                                            fieldErrors()?.password ? "input-error" : ""
                                        }`}
                                        name="password"
                                        type="password"
                                        placeholder="password"
                                    />
                                </div>
                                <Show when={fieldErrors()?.password}>
                                    <label class="label" role="alert">
                                        <span class="label-text-alt">
                                            {fieldErrors()?.password}
                                        </span>
                                    </label>
                                </Show>
                                <Show when={fieldErrors()?.message}>
                                    <label class="label" role="alert" id="error-message">
                                        <span class="label-text-alt">{fieldErrors()?.message}</span>
                                    </label>
                                </Show>
                                <div class="form-control mt-6">
                                    <button class="btn" type="submit">
                                        {data() ? "Login" : ""}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
