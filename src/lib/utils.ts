import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Pusher from 'pusher-js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_ID, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  forceTLS: true
})