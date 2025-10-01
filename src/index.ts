import cookie from "cookie";
import { type ReactNode, useEffect, useState } from "react";

/**
 * FeatureFlagGate
 *
 * EN: Conditionally renders `children` when a feature flag cookie is present and truthy.
 * - Use on the server by passing the full `Cookie` request header via `cookieHeader`.
 * - Use on the client without `cookieHeader`; it will read from `document.cookie`.
 *
 * PT-BR: Renderiza `children` quando o cookie do feature flag estiver presente e for truthy.
 * - No servidor, passe o header `Cookie` completo via `cookieHeader`.
 * - No cliente, omita `cookieHeader`; será lido de `document.cookie`.
 *
 * ES: Renderiza `children` cuando la cookie del feature flag esté presente y sea truthy.
 * - En el servidor, pase el encabezado `Cookie` completo mediante `cookieHeader`.
 * - En el cliente, omita `cookieHeader`; se leerá de `document.cookie`.
 */
interface FeatureFlagGateProps {
  /**
   * EN: Name of the cookie that toggles the feature.
   * PT-BR: Nome do cookie que ativa o recurso.
   * ES: Nombre de la cookie que activa la funcionalidad.
   */
  cookieName: string;
  /**
   * EN: Optional raw `Cookie` header string for SSR.
   * PT-BR: String do header `Cookie` (crua) opcional para SSR.
   * ES: Cadena cruda del encabezado `Cookie` opcional para SSR.
   */
  cookieHeader?: string;
  /**
   * EN: Children to render when the flag is enabled.
   * PT-BR: Children a serem renderizados quando o flag estiver habilitado.
   * ES: Children a renderizar cuando el flag esté habilitado.
   */
  children: ReactNode;
}

export default function FeatureFlagGate({
  cookieName,
  cookieHeader,
  children,
}: FeatureFlagGateProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (cookieHeader) {
      // Already resolved on the server when cookieHeader is provided
      return;
    }

    const parsed = cookie.parse(document.cookie ?? "");
    setEnabled(Boolean(parsed[cookieName]));
  }, [cookieName, cookieHeader]);

  // SSR path: resolve using provided cookie header
  if (cookieHeader) {
    const parsed = cookie.parse(cookieHeader);
    const isEnabled = Boolean(parsed[cookieName]);
    return isEnabled ? children : null;
  }

  // Client path: wait until checked
  if (enabled === null) {
    return null;
  }
  if (!enabled) {
    return null;
  }

  return children;
}
