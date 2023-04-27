import reporter from "@felte/reporter-tippy";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { createSignal } from "solid-js";
import { z } from "zod";

const loginFormSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty(),
    isRegistering: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LoginForm = () => {
    const [submitted, setSubmitted] = createSignal<LoginFormValues>();

    const { form } = createForm<LoginFormValues>({
        initialValues: {
            email: "",
            password: "",
            isRegistering: false,
        },
        onSubmit(values) {
            setSubmitted(values);
        },
        debounced: {
            validate: (values) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (values.email !== "exists@example.com") return resolve({});
                        resolve({
                            email: "Email taken",
                        });
                    }, 1000);
                });
            },
        },
        extend: [reporter(), validator({ schema: loginFormSchema })],
    });

    return (
        <form ref={form}>
            <div id="publicEmail">Register?</div>
            <input type="radio" id="isRegisteringYes" value="yes" name="isRegistering" checked />
            <label for="isRegisteringYes">Yes</label>
            <br />
            <input type="radio" id="isRegisteringNo" value="no" name="isRegistering" />
            <label for="isRegisteringNo">No</label>
            <fieldset>
                <legend>Sign In</legend>
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" />
                <label for="password">Password:</label>
                <input type="password" name="password" id="password" />
            </fieldset>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    );
};
