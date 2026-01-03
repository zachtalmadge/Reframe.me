/**
 * Route Configuration and Utilities
 *
 * Provides centralized route definitions and helper functions for route
 * classification and behavior in the application.
 *
 * Used by:
 * - App.tsx (Router and AppInitializer components)
 * - Any component that needs to navigate with route awareness
 */

/**
 * Route path type - all valid application routes
 */
export type RoutePath =
  | "/"
  | "/selection"
  | "/form"
  | "/loading"
  | "/results"
  | "/faq"
  | "/donate"
  | "/terms-privacy";

/**
 * Route behavior categories
 */
export type RouteCategory =
  | "home" // Entry point
  | "flow" // Requires sequential access
  | "protected" // Preserves data during navigation
  | "static"; // Public informational pages

/**
 * Route configuration object
 */
export interface RouteConfig {
  path: RoutePath;
  category: RouteCategory;
  /**
   * Whether data should be preserved when accessing this route
   * - true: Keep form/results data (protected routes)
   * - false: Clear data on access (static pages, flow routes)
   */
  preserveData: boolean;
  /**
   * Whether direct access is allowed
   * - true: Can access directly via URL
   * - false: Must follow application flow (redirects to home)
   */
  allowDirectAccess: boolean;
  /**
   * Optional description for documentation
   */
  description?: string;
}

/**
 * Centralized route configuration
 *
 * This is the single source of truth for all route behaviors.
 * Modify this object to change route characteristics.
 */
export const ROUTE_CONFIG: Record<RoutePath, RouteConfig> = {
  "/": {
    path: "/",
    category: "home",
    preserveData: false,
    allowDirectAccess: true,
    description: "Landing page - entry point to application",
  },
  "/selection": {
    path: "/selection",
    category: "flow",
    preserveData: false,
    allowDirectAccess: false,
    description: "Tool selection page - requires flow from home",
  },
  "/form": {
    path: "/form",
    category: "flow",
    preserveData: false,
    allowDirectAccess: false,
    description: "Multi-step form page - requires flow from selection",
  },
  "/loading": {
    path: "/loading",
    category: "protected",
    preserveData: true,
    allowDirectAccess: true,
    description: "Document generation page - preserves form data",
  },
  "/results": {
    path: "/results",
    category: "protected",
    preserveData: true,
    allowDirectAccess: true,
    description: "Generated documents page - preserves results data",
  },
  "/faq": {
    path: "/faq",
    category: "static",
    preserveData: false,
    allowDirectAccess: true,
    description: "FAQ page - publicly accessible",
  },
  "/donate": {
    path: "/donate",
    category: "static",
    preserveData: false,
    allowDirectAccess: true,
    description: "Donation page - publicly accessible",
  },
  "/terms-privacy": {
    path: "/terms-privacy",
    category: "static",
    preserveData: false,
    allowDirectAccess: true,
    description: "Terms and Privacy page - publicly accessible",
  },
} as const;

/**
 * Array of all valid route paths
 * Useful for validation and iteration
 */
export const ALL_ROUTES = Object.keys(ROUTE_CONFIG) as RoutePath[];

/**
 * Route arrays by category (for backward compatibility and convenience)
 */
export const PROTECTED_ROUTES: RoutePath[] = ["/loading", "/results"];
export const STATIC_ROUTES: RoutePath[] = ["/faq", "/donate", "/terms-privacy"];
export const FLOW_ROUTES: RoutePath[] = ["/selection", "/form"];

// ============================================================================
// ROUTE CLASSIFICATION HELPERS
// ============================================================================

/**
 * Check if a route is protected (preserves data during navigation)
 *
 * @param path - Route path to check
 * @returns true if route preserves data
 *
 * @example
 * isProtectedRoute("/results") // true
 * isProtectedRoute("/faq")     // false
 */
export function isProtectedRoute(path: string): boolean {
  const config = ROUTE_CONFIG[path as RoutePath];
  return config?.category === "protected" || false;
}

/**
 * Check if a route is a static/informational page
 *
 * @param path - Route path to check
 * @returns true if route is a static page
 *
 * @example
 * isStaticPage("/faq")    // true
 * isStaticPage("/form")   // false
 */
export function isStaticPage(path: string): boolean {
  const config = ROUTE_CONFIG[path as RoutePath];
  return config?.category === "static" || false;
}

/**
 * Check if a route is part of the application flow
 *
 * @param path - Route path to check
 * @returns true if route is a flow route
 *
 * @example
 * isFlowRoute("/form")     // true
 * isFlowRoute("/loading")  // false
 */
export function isFlowRoute(path: string): boolean {
  const config = ROUTE_CONFIG[path as RoutePath];
  return config?.category === "flow" || false;
}

/**
 * Check if a route is the home page
 *
 * @param path - Route path to check
 * @returns true if route is home
 */
export function isHomePage(path: string): boolean {
  return path === "/";
}

/**
 * Check if a route is valid/known to the application
 *
 * @param path - Route path to check
 * @returns true if route exists in configuration
 *
 * @example
 * isValidRoute("/faq")           // true
 * isValidRoute("/unknown-page")  // false
 */
export function isValidRoute(path: string): boolean {
  return path in ROUTE_CONFIG;
}

// ============================================================================
// ROUTE BEHAVIOR HELPERS
// ============================================================================

/**
 * Determine if data should be preserved when accessing a route
 *
 * @param path - Route path to check
 * @returns true if data should be preserved
 *
 * @example
 * shouldPreserveData("/results")  // true (protected route)
 * shouldPreserveData("/faq")      // false (static page)
 */
export function shouldPreserveData(path: string): boolean {
  const config = ROUTE_CONFIG[path as RoutePath];
  return config?.preserveData ?? false;
}

/**
 * Determine if a route allows direct URL access
 *
 * @param path - Route path to check
 * @returns true if direct access is allowed
 *
 * @example
 * allowsDirectAccess("/faq")       // true (static page)
 * allowsDirectAccess("/selection") // false (flow route)
 */
export function allowsDirectAccess(path: string): boolean {
  const config = ROUTE_CONFIG[path as RoutePath];
  return config?.allowDirectAccess ?? true;
}

/**
 * Determine if accessing a route should trigger a redirect to home
 *
 * This is used by AppInitializer to handle invalid direct access.
 *
 * @param path - Route path to check
 * @returns true if should redirect to home
 *
 * @example
 * shouldRedirectToHome("/form")    // true (flow route, no direct access)
 * shouldRedirectToHome("/faq")     // false (static page, direct access OK)
 * shouldRedirectToHome("/loading") // false (protected route, direct access OK)
 */
export function shouldRedirectToHome(path: string): boolean {
  // Home page never redirects to itself
  if (isHomePage(path)) {
    return false;
  }

  // Protected routes and static pages don't redirect
  if (isProtectedRoute(path) || isStaticPage(path)) {
    return false;
  }

  // Flow routes without direct access should redirect
  return !allowsDirectAccess(path);
}

/**
 * Get the route configuration for a path
 *
 * Useful for accessing multiple properties at once or for debugging.
 *
 * @param path - Route path to get config for
 * @returns Route configuration object or undefined if invalid
 *
 * @example
 * const config = getRouteConfig("/results");
 * console.log(config?.category);     // "protected"
 * console.log(config?.preserveData); // true
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
  return ROUTE_CONFIG[path as RoutePath];
}

// ============================================================================
// ROUTE ACTION HELPERS
// ============================================================================

/**
 * Get the appropriate redirect destination for an invalid route access
 *
 * @param _path - The invalid route path (currently unused, reserved for future logic)
 * @returns The path to redirect to (currently always "/")
 *
 * @example
 * getRedirectDestination("/form")  // "/"
 */
export function getRedirectDestination(_path: string): RoutePath {
  // Currently always redirects to home
  // Could be extended in the future for more sophisticated redirect logic
  return "/";
}

/**
 * Log route access for debugging
 *
 * Helper for consistent logging format across route operations.
 *
 * @param path - Route being accessed
 * @param action - Action being taken
 * @param metadata - Additional metadata to log
 *
 * @example
 * logRouteAccess("/form", "redirect", { reason: "no direct access" });
 */
export function logRouteAccess(
  path: string,
  action: "access" | "redirect" | "preserve-data" | "clear-data",
  metadata?: Record<string, unknown>
): void {
  const config = getRouteConfig(path);
  console.log(`[Route ${action}] ${path}`, {
    category: config?.category,
    ...metadata,
  });
}
