// @refresh reload
import { Suspense } from "solid-js";
import {
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Link,
    Meta,
    Routes,
    Scripts,
    Title,
} from "solid-start";
import "tippy.js/dist/tippy.css";
import "./root.css";

export default function Root() {
    return (
        <Html>
            <Head>
                <Title>SolidStart - With Auth</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
                <Link
                    rel="stylesheet"
                    type="text/css"
                    href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css"
                />
            </Head>
            <Body class="dark">
                <ErrorBoundary>
                    <Suspense fallback={<div>Loading</div>}>
                        <Routes>
                            <FileRoutes />
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
                <Scripts />
            </Body>
        </Html>
    );
}
