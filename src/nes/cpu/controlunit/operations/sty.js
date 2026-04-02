import { Operation } from "./operation.js"

class STY extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    this.operand = this.cpu.register.Y
    this.writeAtAddress()
  }

  zeropage = () => {
    this.fetchZeroPage(false)
    this.updateAndWrite()
  }

  zeropagex = () => {
    this.fetchZeroPageX(false)
    this.updateAndWrite()
  }

  absolute = () => {
    this.fetchAbsolute(false)
    this.updateAndWrite()
  }
}

export { STY }
