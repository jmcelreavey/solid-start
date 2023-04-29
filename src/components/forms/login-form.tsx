import reporter from "@felte/reporter-tippy";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { z } from "zod";

const loginFormSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
    isRegistering: z.string().nonempty("Login type is required"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

type LoginFormResponse = {
    errors?: { [key: string]: string | undefined };
};

export function LoginForm(props: {
    onSubmit: (values: LoginFormValues) => Promise<LoginFormResponse>;
}) {
    const { form, data, isValid } = createForm<LoginFormValues>({
        initialValues: {
            username: "",
            password: "",
            isRegistering: "no",
        },
        async onSubmit(values, context) {
            const result = await props.onSubmit(values);

            if (result.errors) {
                context.setErrors(result.errors);
                throw result;
            }

            return result;
        },
        onSuccess(values) {
            console.log(values);
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
                <button class="btn btn-primary" type="submit" disabled={!isValid()}>
                    {submitButtonText()}
                </button>
            </div>
        </form>
    );
}
