import { Operation } from "./operation.js"

class STX extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    this.operand = this.cpu.register.X
    this.writeAtAddress()
  }

  zeropage = () => {
    this.fetchZeroPage(false)
    this.updateAndWrite()
  }

  zeropagey = () => {
    this.fetchZeroPageY(false)
    this.updateAndWrite()
  }

  absolute = () => {
    this.fetchAbsolute(false)
    this.updateAndWrite()
  }
}

export { STX }
