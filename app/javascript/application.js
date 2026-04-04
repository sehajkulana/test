// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo"
import { createCable } from "@anycable/web"
import { start } from "@anycable/turbo-stream"

// Use extended Action Cable protocol to support reliable streams and presence
// See https://github.com/anycable/anycable-client
const cable = createCable({ protocol: 'actioncable-v1-ext-json' })
// Prevent frequent resubscriptions during morphing or navigation
start(cable, { delayedUnsubscribe: true })

import "controllers"
import "channels"

if (document.getElementById("products")) {
  import("broadcasting")
}
