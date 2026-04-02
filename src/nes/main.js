import { writeRegister, initApu, volume } from "./apu/apu.js"
import ThreadCommunicator from "./debugger/debugger.js"

class Nes {
  constructor() {
    this.worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" })
    this.ppuMemory = new SharedArrayBuffer(256 * 240 * 4)
    this.controllers = new SharedArrayBuffer(2)
    this.threadCommunicator = new ThreadCommunicator({ worker: this.worker, writeRegister, ppuMemory: this.ppuMemory, controllers: this.controllers })
    this.worker.postMessage({ frame: true, framebuffer: this.ppuMemory, controllers: this.controllers })
  }
}

export { Nes, initApu, volume }
