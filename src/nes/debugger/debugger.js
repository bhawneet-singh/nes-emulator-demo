const controllerMap = {
  "a": 0x80,
  "s": 0x40,
  "d": 0x20,
  "f": 0x10,
  "ArrowUp": 0x08,
  "ArrowDown": 0x04,
  "ArrowLeft": 0x02,
  "ArrowRight": 0x01
}

class ThreadCommunicator {
  controller = {
    "a": false,
    "s": false,
    "d": false,
    "f": false,
    "ArrowUp": false,
    "ArrowDown": false,
    "ArrowLeft": false,
    "ArrowRight": false
  }
  constructor({ worker, writeRegister, ppuMemory, controllers }) {
    this.worker = worker
    this.registers = document.querySelector(".registers")
    this.flags = document.querySelector(".flags")

    this.controllers = new Uint8ClampedArray(controllers)

    this.sharedBuffer = new Uint8ClampedArray(ppuMemory)
    this.framebuffer = new Uint8ClampedArray(this.sharedBuffer.length)

    this.writeRegister = writeRegister

    this.initEvent()
    this.initController()
  }

  initController() {
    window.addEventListener("keydown", (e) => {
      e.preventDefault()
      if (controllerMap[e.key] && !(this.controllers[0] & controllerMap[e.key])) {
        this.controllers[0] = (this.controllers[0] | controllerMap[e.key])
      }
    })
    window.addEventListener("keyup", (e) => {
      e.preventDefault()
      if ((this.controllers[0] & controllerMap[e.key])) {
        this.controllers[0] = (this.controllers[0] & (((~controllerMap[e.key]) >>> 0) & 0xff))
      }
    })
  }

  initDisplay(nesDisplay) {
    this.nesDisplay = nesDisplay
    this.ctx = this.nesDisplay.getContext("2d")
    this.nesDisplay.width = 8 * 32
    this.nesDisplay.height = 8 * 30
    this.displayImage()
  }

  displayImage = () => {
    this.framebuffer.set(this.sharedBuffer)
    this.ctx?.putImageData(new ImageData(this.framebuffer, 256, 240), 0, 0)
    requestAnimationFrame(this.displayImage)
  }

  setBreakPoint = (target) => {
    if (this.stopAddressElement)
      this.stopAddressElement.style.background = "transparent"
    target.style.background = "rgb(255,255,255,0.5)"
    this.stopAddressElement = target
    this.stopAddress = parseInt(target.children[2].textContent)
  }

  initEvent() {
    this.worker.addEventListener("message", (event) => {
      const message = event.data
      this[message.type] && this[message.type](message.data)
    })
  }

  apu = (data) => {
    this.writeRegister(data)
  }
}

export default ThreadCommunicator
