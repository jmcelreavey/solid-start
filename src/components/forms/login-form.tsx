import { Pressable } from "@ark-ui/solid";
import reporter from "@felte/reporter-tippy";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { isResponse } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { z } from "zod";
import { createUserSession, dupeCheck, login, register } from "~/db/session";

const loginFormSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
    isRegistering: z.string().nonempty("Login type is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const [_loggingIn, logIn] = createServerAction$(async (values: LoginFormValues) => {
        const { username, password, isRegistering } = values;

        if (isRegistering === "yes") {
            const userExists = await dupeCheck({ username });
            if (userExists) {
                return {
                    errors: {
                        username: "Username already exists.",
                    },
                };
            }
            const user = await register({ username, password });
            return createUserSession(`${user.id}`, "/");
        } else {
            const user = await login({ username, password });
            if (!user) {
                return {
                    errors: {
                        username: "Invalid username or password.",
                        password: "Invalid username or password.",
                    },
                };
            }
            return createUserSession(`${user.id}`, "/");
        }
    });

    const { form, data, isValid } = createForm<LoginFormValues>({
        initialValues: {
            username: "",
            password: "",
            isRegistering: "no",
        },
        async onSubmit(values, context) {
            const login = await logIn(values);
            if (!isResponse(login) && login.errors) {
                context.setErrors(login.errors);
                throw login;
            }
        },
        extend: [
            reporter({
                tippyProps: {
                    showOnCreate: true,
                    hideOnClick: false,
                    duration: 0,
                    delay: 0,
                    placement: "right",
                },
            }),
            validator({ schema: loginFormSchema }),
        ],
    });

    const submitButtonText = () =>
        data(($data) => {
            return $data.isRegistering === "yes" ? "Register" : "Login";
        });

    return (
        <form class="form-control" ref={form}>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Login</span>
                    <input
                        class="radio"
                        type="radio"
                        id="isRegisteringNo"
                        value="no"
                        name="isRegistering"
                        checked
                    />
                </label>
            </div>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Register</span>
                    <input
                        class="radio"
                        type="radio"
                        id="isRegisteringYes"
                        value="yes"
                        name="isRegistering"
                    />
                </label>
            </div>
            <div class="divider" />
            <div class="form-control">
                <label class="label" for="username">
                    <span class="label-text">Username:</span>
                </label>
                <input
                    type="text"
                    class={`input input-bordered aria-[invalid]:input-error`}
                    name="username"
                    id="username"
                    placeholder="username"
                />
            </div>
            <div class="form-control">
                <label class="label" for="password">
                    <span class="label-text">Password:</span>
                </label>
                <input
                    class={`input input-bordered aria-[invalid]:input-error`}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <label class="label">
                    <a href="#" class="label-text-alt link link-hover">
                        Forgot password?
                    </a>
                </label>
            </div>
            <div class="form-control mt-6">
                <Pressable class="btn btn-primary" type="submit" disabled={!isValid()}>
                    {submitButtonText()}
                </Pressable>
            </div>
        </form>
    );
}
