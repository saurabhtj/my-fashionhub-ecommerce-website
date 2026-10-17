export type RazorpayMode = 'test' | 'live';
export function resolveRazorpayMode(configuredMode: string | undefined, keyId: string): RazorpayMode;
export function getRazorpayOrderFailure(error: unknown): {
  statusCode?: number;
  code?: string;
  description?: string;
  message: string;
};
