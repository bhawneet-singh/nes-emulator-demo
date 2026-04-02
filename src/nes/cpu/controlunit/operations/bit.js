import { Operation } from "./operation.js"

class BIT extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateFlags = () => {
    this.cpu.flags.V = (this.operand & 0x40) ? 1 : 0
    this.cpu.flags.N = (this.operand & 0x80) ? 1 : 0
    this.cpu.flags.Z = ((this.operand & this.cpu.register.A) === 0) ? 1 : 0
  }

  zeropage = () => {
    this.fetchZeroPage()
    this.updateFlags()
  }

  absolute = () => {
    this.fetchAbsolute()
    this.updateFlags()
  }
}

export { BIT }
