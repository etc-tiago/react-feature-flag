## FeatureFlagGate

See in [Português (pt-BR)](#featureflaggate-em-português-pt-br) and [Espanhol (es-ES)](#featureflaggate-en-español-es-es).

A tiny React component that conditionally renders its children based on the presence of a cookie (feature flag). Works in both client and server-rendered contexts.

### Installation

```bash
pnpm add cookie
```

### Usage

```tsx
import FeatureFlagGate from "./src";

export function Example() {
  return (
    <FeatureFlagGate cookieName="my_feature_flag">
      <div>This content shows only when the flag cookie is set</div>
    </FeatureFlagGate>
  );
}
```

### Server-side rendering (SSR)

Pass the raw `Cookie` request header string through the `cookieHeader` prop.

```tsx
import FeatureFlagGate from "./src";

export function ExampleSSR({ cookieHeader }: { cookieHeader: string }) {
  return (
    <FeatureFlagGate cookieName="my_feature_flag" cookieHeader={cookieHeader}>
      <div>SSR-gated content</div>
    </FeatureFlagGate>
  );
}
```

### API

- `cookieName: string` — Name of the cookie that toggles the feature.
- `cookieHeader?: string` — Optional raw `Cookie` header for SSR. When provided, the component resolves the flag on the server.
- `children: ReactNode` — Content to render when the flag is enabled.

### Behavior

- If `cookieHeader` is provided (SSR path), the flag is resolved from that header and the component returns `children` only when the cookie is present and truthy; otherwise returns `null`.
- If `cookieHeader` is not provided (client path), the component reads from `document.cookie` on mount and renders `children` only when the cookie is present and truthy; otherwise returns `null`. While checking, it returns `null` to avoid flicker.


