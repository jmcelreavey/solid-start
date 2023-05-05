import reporter from "@felte/reporter-tippy";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { Button } from "@kobalte/core";
import { isResponse } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { z } from "zod";
import { createMemberSession, dupeCheck, login, register } from "~/db/session";

const loginFormSchema = z.object({
    email: z.string().email().nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
    isRegistering: z.string().nonempty("Login type is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const [loggingIn, logIn] = createServerAction$(async (values: LoginFormValues) => {
        const { email, password, isRegistering } = values;

        if (isRegistering === "yes") {
            const memberExists = await dupeCheck({ email });
            if (memberExists) {
                return {
                    errors: {
                        email: "Email already in use.",
                    },
                };
            }
            const member = await register({ email, password });
            return createMemberSession(`${member.id}`, "/");
        } else {
            const member = await login({ email, password });
            if (!member) {
                return {
                    errors: {
                        email: "Invalid email or password.",
                        password: "Invalid email or password.",
                    },
                };
            }
            return createMemberSession(`${member.id}`, "/");
        }
    });

    const { form, data, isValid } = createForm<LoginFormValues>({
        initialValues: {
            email: "",
            password: "",
            isRegistering: "no",
        },
        async onSubmit(values, context) {
            const login = await logIn(values);
            if (!isResponse(login) && login?.errors) {
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
        data((data) => {
            if (loggingIn.pending) {
                return "Submitting...";
            }

            return data.isRegistering === "yes" ? "Register" : "Login";
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
                <label class="label" for="email">
                    <span class="label-text">Email:</span>
                </label>
                <input
                    type="text"
                    class={`input input-bordered aria-[invalid]:input-error`}
                    name="email"
                    id="email"
                    placeholder="email"
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
                <Button.Root class="btn btn-primary" type="submit" disabled={!isValid()}>
                    {submitButtonText()}
                </Button.Root>
            </div>
        </form>
    );
}
