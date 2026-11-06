import { ApiError } from "./ApiError";

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> | undefined),
    };

    if (init.body !== undefined && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new ApiError(
        response.status,
        errorText || `HTTP Error ${response.status}: ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  }

  public get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: "GET", signal });
  }

  public post<T, B>(path: string, body: B, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      signal,
    });
  }
}

export const apiClient = new ApiClient("https://dummyjson.com");