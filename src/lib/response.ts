/* eslint-disable @typescript-eslint/no-explicit-any */
type JsonResponseOptions = {
  status?: number;
  message?: string;
};

export function jsonResponse(
  data: any,
  options: JsonResponseOptions = {}
): Response {
  const { status = 200, message } = options;

  return new Response(
    JSON.stringify({
      success: true,
      ...(message && { message }),
      data,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function errorResponse(
  error: string,
  status = 500,
  details?: any
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        message: error,
        ...(details && { details }),
      },
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
