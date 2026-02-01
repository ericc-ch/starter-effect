import { env } from "cloudflare:workers"
import { createApp } from "./app"
import { createServices } from "./lib/services"

export default createApp(createServices(env))
