import { API_URL } from "@/lib/config";

class APIError extends Error {
  status: number;
  detail?: object;
  constructor(status: number, message: string, detail?: object) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export async function request<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: FormData | object | null = null,
  headers: HeadersInit = {}
): Promise<T | null> {
  let requestBody;
  let requestHeaders = headers;


  if (body instanceof FormData) {
    requestBody = body;
  } else {
    requestHeaders = { "Content-Type": "application/json", ...requestHeaders };
    requestBody = body ? JSON.stringify(body) : undefined;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
  });

  if (!response.ok) {
    const message =
      response.status === 500
        ? "Error in processing your request!"
        : response.statusText;

    let errorResponse;
    try {
      const respBody = await response.json();
      errorResponse = respBody.detail;
    } catch {
      errorResponse = await response.text();

    }
    throw new APIError(response.status, message, errorResponse);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  } else if (contentType?.includes("text/")) {
    const text = await response.text();
    return text as unknown as T;
  } else {
    throw new APIError(415, "Unsupported response content type", {
      contentType,
    });
  }
}
