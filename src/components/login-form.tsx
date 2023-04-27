import { createForm } from "@felte/solid";
import reporter from "@felte/reporter-tippy";
import { validator } from "@felte/validator-zod";
import { createSignal } from "solid-js";

type LoginFormValues = {
    email: string;
    password: string;
    isRegistering: boolean;
};

export const LoginForm = () => {
    const [submitted, setSubmitted] = createSignal<LoginFormValues>();

    const { form } = createForm<LoginFormValues>({
        onSubmit(values) {
            setSubmitted(values);
        },
        validate(values) {
            const errors: { email: string[]; password: string[] } = {
                email: [],
                password: [],
            };
            if (!values.email) errors.email.push("Must not be empty");
            if (!/[a-zA-Z][^@]*@[a-zA-Z][^@.]*\.[a-z]{2,}/.test(values.email))
                errors.email.push("Must be a valid email");
            if (!values.password) errors.password.push("Must not be empty");
            return errors;
        },
        extend: reporter(),
    });

    return (
        <form use:form>
            <fieldset>
                <legend>Sign In</legend>
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" />
                <ValidationMessage for="email" as="ul" aria-live="polite">
                    {(messages) => (
                        <Index each={messages ?? []}>{(message) => <li>{message}</li>}</Index>
                    )}
                </ValidationMessage>
                <label for="password">Password:</label>
                <input type="password" name="password" id="password" />
                <ValidationMessage for="password" as="ul" aria-live="polite">
                    {(messages) => (
                        <Index each={messages ?? []}>{(message) => <li>{message}</li>}</Index>
                    )}
                </ValidationMessage>
            </fieldset>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    );
};
