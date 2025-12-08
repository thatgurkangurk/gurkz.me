import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";

export function Devtools() {
  return (
    <TanStackDevtools
      plugins={[
        {
          name: "TanStack Query",
          render: <ReactQueryDevtoolsPanel />,
          defaultOpen: true,
        },
        {
          name: "TanStack Router",
          render: <TanStackRouterDevtoolsPanel />,
          defaultOpen: false,
        },
        formDevtoolsPlugin(),
      ]}
    />
  );
}
