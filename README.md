## FeatureFlagGate

See in [Português (pt-BR)](#featureflaggate-em-português-pt-br) and [Espanhol (es-ES)](#featureflaggate-en-español-es-es).

A tiny React component that conditionally renders its children based on the presence of a cookie (feature flag). Works in both client and server-rendered contexts.

### Installation

```bash
pnpm add react-single-feature-flag
```

### Usage

```tsx
import FeatureFlagGate from "react-single-feature-flag";

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
import FeatureFlagGate from "react-single-feature-flag";

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

---

## Tradução (pt-BR)

Componente React simples que renderiza condicionalmente seus filhos com base na presença de um cookie (feature flag). Funciona em contextos de renderização no cliente e no servidor.

### Instalação

```bash
pnpm add react-single-feature-flag
```

### Uso

```tsx
import FeatureFlagGate from "react-single-feature-flag";

export function Exemplo() {
  return (
    <FeatureFlagGate cookieName="meu_feature_flag">
      <div>Este conteúdo aparece apenas quando o cookie do flag está definido</div>
    </FeatureFlagGate>
  );
}
```

### SSR (server-side rendering)

Informe a string crua do header `Cookie` pela prop `cookieHeader`.

```tsx
import FeatureFlagGate from "react-single-feature-flag";

export function ExemploSSR({ cookieHeader }: { cookieHeader: string }) {
  return (
    <FeatureFlagGate cookieName="meu_feature_flag" cookieHeader={cookieHeader}>
      <div>Conteúdo controlado por flag no SSR</div>
    </FeatureFlagGate>
  );
}
```

### API

- `cookieName: string` — Nome do cookie que ativa o recurso.
- `cookieHeader?: string` — Header `Cookie` cru opcional para SSR. Quando presente, a verificação ocorre no servidor.
- `children: ReactNode` — Conteúdo a ser renderizado quando o flag estiver habilitado.

### Comportamento

- Se `cookieHeader` for fornecido (caminho SSR), o flag é resolvido a partir dele e o componente retorna `children` apenas quando o cookie estiver presente e truthy; caso contrário, retorna `null`.
- Se `cookieHeader` não for fornecido (caminho cliente), o componente lê de `document.cookie` no mount e renderiza `children` apenas quando o cookie estiver presente e truthy; caso contrário, retorna `null`. Durante a verificação, retorna `null` para evitar flicker.

---

## Traducción (ES)

Componente de React que renderiza condicionalmente sus hijos según la presencia de una cookie (feature flag). Funciona tanto en cliente como en servidor.

### Instalación

```bash
pnpm add react-single-feature-flag
```

### Uso

```tsx
import FeatureFlagGate from "react-single-feature-flag";

export function Ejemplo() {
  return (
    <FeatureFlagGate cookieName="mi_feature_flag">
      <div>Este contenido se muestra solo cuando la cookie del flag está presente</div>
    </FeatureFlagGate>
  );
}
```

### Renderizado del lado del servidor (SSR)

Pase la cadena cruda del encabezado `Cookie` mediante la prop `cookieHeader`.

```tsx
import FeatureFlagGate from "react-single-feature-flag";

export function EjemploSSR({ cookieHeader }: { cookieHeader: string }) {
  return (
    <FeatureFlagGate cookieName="mi_feature_flag" cookieHeader={cookieHeader}>
      <div>Contenido controlado por flag en SSR</div>
    </FeatureFlagGate>
  );
}
```

### API

- `cookieName: string` — Nombre de la cookie que activa la funcionalidad.
- `cookieHeader?: string` — Encabezado `Cookie` crudo opcional para SSR. Cuando se proporciona, la verificación ocurre en el servidor.
- `children: ReactNode` — Contenido a renderizar cuando el flag esté habilitado.

### Comportamiento

- Si se proporciona `cookieHeader` (ruta SSR), el flag se resuelve desde ese encabezado y el componente devuelve `children` solo cuando la cookie está presente y es truthy; de lo contrario, devuelve `null`.
- Si no se proporciona `cookieHeader` (ruta cliente), el componente lee desde `document.cookie` al montar y renderiza `children` solo cuando la cookie está presente y es truthy; de lo contrario, devuelve `null`. Mientras verifica, devuelve `null` para evitar parpadeo.


