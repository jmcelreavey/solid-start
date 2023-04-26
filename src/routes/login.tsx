import { Show } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { db } from "~/db";
import { createUserSession, getUser, login, register } from "~/db/session";
import { createForm, required, minLength } from "@modular-forms/solid";

type LoginForm = {
    username: string;
    password: string;
};

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

    const [loggingIn, loggingInAction] = createServerAction$(async (form: FormData) => {
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

    const [loginForm, Login] = createForm<LoginForm>();

    return (
        <main>
            <h1>Login</h1>
            <Login.Form
                onSubmit={(values, submitEvent) => {
                    loggingInAction({ values });
                }}
            >
                <Login.Field
                    validate={[
                        required("Please enter a username."),
                        minLength(3, "Your username must have 3 characters or more."),
                    ]}
                    name="username"
                >
                    {(field, props) => (
                        <>
                            <input {...props} type="username" required />
                            {field.error && <div>{field.error}</div>}
                        </>
                    )}
                </Login.Field>
                <Login.Field
                    validate={[
                        required("Please enter a password."),
                        minLength(3, "Your password must have 3 characters or more."),
                    ]}
                    name="password"
                >
                    {(field, props) => (
                        <>
                            <input {...props} type="password" required />
                            {field.error && <div>{field.error}</div>}
                        </>
                    )}
                </Login.Field>
                <input type="submit" />
            </Login.Form>
        </main>
    );
}
