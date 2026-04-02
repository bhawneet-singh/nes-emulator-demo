import { Operation } from "./operation.js"

class CPX extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateFlags = () => {
    const result = this.cpu.register.X - this.operand
    this.cpu.flags.C = (this.cpu.register.X >= this.operand) ? 1 : 0
    this.cpu.flags.N = (result & 0x80) ? 1 : 0
    this.cpu.flags.Z = (result === 0) ? 1 : 0
  }

  immediate = () => {
    this.fetchImmediate()
    this.updateFlags()
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

export { CPX }
