import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["orbit", "node", "card"]

  connect() {
    this.rotationAngle = 0
    this.activeNodeId = null
    this.autoRotate = true
    this.tick = this.tick.bind(this)
    this.updatePositions()
    this.timer = window.setInterval(this.tick, 50)
    this.resizeObserver = new ResizeObserver(() => this.updatePositions())
    this.resizeObserver.observe(this.element)
  }

  disconnect() {
    window.clearInterval(this.timer)
    this.resizeObserver?.disconnect()
  }

  tick() {
    if (!this.autoRotate) return

    this.rotationAngle = (this.rotationAngle + 0.3) % 360
    this.updatePositions()
  }

  toggle(event) {
    event.stopPropagation()
    if (event.target.closest(".orbital-card")) return

    const node = event.currentTarget
    const id = Number(node.dataset.nodeId)

    if (this.activeNodeId === id) {
      this.clearActive()
      return
    }

    this.activateNode(id)
  }

  jump(event) {
    event.stopPropagation()
    this.activateNode(event.params.nodeId)
  }

  reset(event) {
    if (event.target !== this.element && event.target !== this.orbitTarget) return
    this.clearActive()
  }

  activateNode(id) {
    this.activeNodeId = Number(id)
    this.autoRotate = false
    this.centerViewOnNode(this.activeNodeId)
    this.updateStateClasses()
    this.updatePositions()
  }

  clearActive() {
    this.activeNodeId = null
    this.autoRotate = true
    this.updateStateClasses()
  }

  centerViewOnNode(id) {
    const index = this.nodeTargets.findIndex((node) => Number(node.dataset.nodeId) === id)
    if (index < 0) return

    const targetAngle = (index / this.nodeTargets.length) * 360
    this.rotationAngle = 270 - targetAngle
  }

  updatePositions() {
    const radius = this.radius

    this.nodeTargets.forEach((node, index) => {
      const angle = ((index / this.nodeTargets.length) * 360 + this.rotationAngle) % 360
      const radian = (angle * Math.PI) / 180
      const x = radius * Math.cos(radian)
      const y = radius * Math.sin(radian)
      const depth = (1 + Math.sin(radian)) / 2

      node.style.transform = `translate(${x}px, ${y}px)`
      node.style.zIndex = node.classList.contains("is-active") ? 200 : Math.round(100 + 50 * Math.cos(radian))
      node.style.opacity = node.classList.contains("is-active") ? 1 : Math.max(0.42, 0.42 + 0.58 * depth)
      node.style.setProperty("--orbital-energy-size", `${Number(node.dataset.energy) * 0.5 + 40}px`)
    })
  }

  updateStateClasses() {
    const activeNode = this.nodeTargets.find((node) => Number(node.dataset.nodeId) === this.activeNodeId)
    const relatedIds = activeNode ? this.relatedIdsFor(activeNode) : []

    this.nodeTargets.forEach((node) => {
      const id = Number(node.dataset.nodeId)
      node.classList.toggle("is-active", id === this.activeNodeId)
      node.classList.toggle("is-related", relatedIds.includes(id))
      node.classList.toggle("is-muted", this.activeNodeId !== null && id !== this.activeNodeId && !relatedIds.includes(id))
    })
  }

  relatedIdsFor(node) {
    return (node.dataset.relatedIds || "")
      .split(",")
      .filter(Boolean)
      .map((id) => Number(id))
  }

  get radius() {
    const width = this.element.getBoundingClientRect().width
    return Math.max(118, Math.min(200, (width - 180) / 2))
  }
}
