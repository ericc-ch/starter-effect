import { env } from "./env"

export interface Book {
  id: number
  title: string
  author: string
}

export interface BookInsert {
  title: string
  author: string
}

export interface BookUpdate {
  title?: string
  author?: string
}

class RpcClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async call<T>(method: string, payload: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}/rpc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        method,
        payload,
      }),
    })

    if (!response.ok) {
      const error = (await response
        .json()
        .catch(() => ({ message: "Unknown error" }))) as { message: string }
      throw new Error(error.message || `RPC call failed: ${response.status}`)
    }

    return response.json()
  }

  books = {
    list: () => this.call<{ data: Book[] }>("books.list", {}),
    get: (id: number) => this.call<Book>("books.get", { id }),
    create: (data: BookInsert) => this.call<Book>("books.create", data),
    update: (id: number, data: BookUpdate) =>
      this.call<Book>("books.update", { id, data }),
    delete: (id: number) => this.call<Book>("books.delete", { id }),
  }
}

export const rpc = new RpcClient(env.VITE_API_URL)
