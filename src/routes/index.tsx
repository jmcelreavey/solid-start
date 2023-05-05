import { Button } from "@kobalte/core";
import { Head, Meta, Title, refetchRouteData, useRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { Layout } from "~/components/layout";
import { logout } from "~/db/session";
import { useMember } from "../db/useMember";

export function routeData() {
    return useMember();
}

export default function Home() {
    const member = useRouteData<typeof routeData>();
    const [, { Form }] = createServerAction$((f: FormData, { request }) => logout(request));

    return (
        <Layout>
            <Head>
                <Title>Reactive</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div class="hero bg-base-200">
                <div class="hero-content flex-col lg:flex-row-reverse">
                    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div class="card-body items-center text-center">
                            <h2 class="card-title">Message board</h2>
                            <p>Hello {member()?.email}</p>
                            <div class="card-actions mt-2">
                                <Button.Root class="btn" onClick={() => refetchRouteData()}>
                                    Refresh
                                </Button.Root>
                                <Form class="form-control">
                                    <Button.Root class="btn" name="logout" type="submit">
                                        Logout
                                    </Button.Root>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
