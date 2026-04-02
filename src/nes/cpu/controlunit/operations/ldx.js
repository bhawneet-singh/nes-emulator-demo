import { Operation } from "./operation.js"

class LDX extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    this.updateFlags({ n: true, z: true })
    this.writeRegisterX()
  }

  immediate = () => {
    this.fetchImmediate()
    this.updateAndWrite()
  }

  zeropage = () => {
    this.fetchZeroPage()
    this.updateAndWrite()
  }

  zeropagey = () => {
    this.fetchZeroPageY()
    this.updateAndWrite()
  }

  absolute = () => {
    this.fetchAbsolute()
    this.updateAndWrite()
  }

  absolutey = () => {
    this.fetchAbsoluteY()
    this.updateAndWrite()
  }
}

export { LDX }
