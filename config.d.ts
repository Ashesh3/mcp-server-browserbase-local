import type { AvailableModelSchema } from "@browserbasehq/stagehand";

export type Config = {
  /**
   * Environment mode: "BROWSERBASE" (cloud) or "LOCAL" (local headless browser)
   * @default "BROWSERBASE"
   */
  env?: "BROWSERBASE" | "LOCAL";
  /**
   * Browserbase API Key to authenticate requests
   */
  browserbaseApiKey?: string;
  /**
   * Browserbase Project ID associated with the API key
   */
  browserbaseProjectId?: string;
  /**
   * Whether or not to use Browserbase proxies
   * https://docs.browserbase.com/features/proxies
   *
   * @default false
   */
  proxies?: boolean;
  /**
   * Use advanced stealth mode. Only available to Browserbase Scale Plan users.
   *
   * @default false
   */
  advancedStealth?: boolean;
  /**
   * Whether or not to keep the Browserbase session alive
   *
   * @default false
   */
  keepAlive?: boolean;
  /**
   * Potential Browserbase Context to use
   * Would be a context ID
   */
  context?: {
    /**
     * The ID of the context to use
     */
    contextId?: string;
    /**
     * Whether or not to persist the context
     *
     * @default true
     */
    persist?: boolean;
  };
  /**
   * The viewport of the browser
   * @default { browserWidth: 1024, browserHeight: 768 }
   */
  viewPort?: {
    /**
     * The width of the browser
     */
    browserWidth?: number;
    /**
     * The height of the browser
     */
    browserHeight?: number;
  };
  /**
   * Server configuration for MCP transport layer
   *
   * Controls how the MCP server binds and listens for connections.
   * When port is specified, the server will start an SHTTP transport.
   * When both port and host are undefined, the server uses stdio transport.
   *
   * Security considerations:
   * - Use localhost (default) for local development
   * - Use 0.0.0.0 only when you need external access and have proper security measures
   * - Consider firewall rules and network security when exposing the server
   */
  server?: {
    /**
     * The port to listen on for SHTTP or MCP transport.
     * If undefined, uses stdio transport instead of HTTP.
     *
     * @example 3000
     */
    port?: number;
    /**
     * The host to bind the server to.
     *
     * @default "localhost" - Only accepts local connections
     * @example "0.0.0.0" - Accepts connections from any interface (use with caution)
     */
    host?: string;
  };
  /**
   * The Model that Stagehand uses
   * Available models: OpenAI, Claude, Gemini, Cerebras, Groq, and other providers
   *
   * @default "gemini-2.0-flash"
   */
  modelName?: z.infer<typeof AvailableModelSchema>;
  /**
   * API key for the custom model provider
   * Required when using a model other than the default gemini-2.0-flash
   */
  modelApiKey?: string;
  /**
   * Enable experimental features
   *
   * @default false
   */
  experimental?: boolean;
  /**
   * Screenshot configuration for LOCAL mode
   */
  screenshot?: {
    /**
     * Enable screenshot capture after each action
     * @default true
     */
    enabled?: boolean;
    /**
     * Directory to save screenshots
     * @default "/tmp/stagehand-screenshots"
     */
    dir?: string;
    /**
     * Session ID for organizing screenshots
     */
    sessionId?: string;
  };
  /**
   * Local browser launch options (only for LOCAL mode)
   */
  localBrowserLaunchOptions?: {
    headless?: boolean;
    executablePath?: string;
    args?: string[];
    /**
     * Browser channel to use. When set to "msedge", the server will
     * auto-detect the Edge executable path if executablePath is not set.
     * @default undefined (uses chrome-launcher's default Chrome discovery)
     */
    channel?: "msedge" | "msedge-beta" | "msedge-canary" | "msedge-dev" | "chrome" | "chrome-beta" | "chrome-canary" | "chrome-dev";
    /**
     * User data directory for browser profile persistence.
     * If not set, a stable platform-specific default is used (not a random temp dir).
     */
    userDataDir?: string;
    /**
     * Keep the user data directory after browser closes.
     * @default true
     */
    preserveUserDataDir?: boolean;
    /**
     * Edge/Chrome profile subdirectory within the user data dir.
     * e.g. "Default", "Profile 1", "Profile 2"
     * Maps to --profile-directory Chrome flag.
     * @default "Default"
     */
    profileDirectory?: string;
  };
};
