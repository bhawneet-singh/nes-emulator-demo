import { Bus } from "./bus/bus.js"

let bus = null
let speed = 0
let framebuffer = null
let emulationSpeed = 3000
let controllers = null

const frame = () => {
  for (let i = 0; i < emulationSpeed; i++) {
    const cycles = bus.cpu.clock()
    for (let j = 0; j < cycles * 3; j++) {
      bus.ppu.clock()
    }
  }
  setTimeout(frame, speed)
}

onmessage = async (event) => {
  const data = event.data
  if (data.run) {
    bus = new Bus({ cartridge: data.cartridge })
    bus.ppu.framebuffer = framebuffer
    bus.controllers = controllers
    frame()
  } else if (data.frame) {
    framebuffer = new Uint8ClampedArray(data.framebuffer)
    controllers = new Uint8ClampedArray(data.controllers)
  } else if (data.speed) {
    emulationSpeed = data.emulationSpeed
  }
}
