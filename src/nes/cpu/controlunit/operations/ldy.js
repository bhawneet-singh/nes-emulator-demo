
import { Operation } from "./operation.js"

class LDY extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    this.updateFlags({ n: true, z: true })
    this.writeRegisterY()
  }

  immediate = () => {
    this.fetchImmediate()
    this.updateAndWrite()
  }

  zeropage = () => {
    this.fetchZeroPage()
    this.updateAndWrite()
  }

  zeropagex = () => {
    this.fetchZeroPageX()
    this.updateAndWrite()
  }

  absolute = () => {
    this.fetchAbsolute()
    this.updateAndWrite()
  }

  absolutex = () => {
    this.fetchAbsoluteX()
    this.updateAndWrite()
  }
}

export { LDY }
