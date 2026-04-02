import { Operation } from "./operation.js"

class SBC extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    const result = this.cpu.register.A + (this.operand ^ 0xFF) + this.cpu.flags.C
    this.cpu.flags.V = (((this.cpu.register.A ^ this.operand) & (this.cpu.register.A ^ result)) >>> 7)
    this.operand = result
    this.updateFlags({ n: true, z: true, c: true })
    this.writeRegisterA()
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

  absolutey = () => {
    this.fetchAbsoluteY()
    this.updateAndWrite()
  }

  indirectx = () => {
    this.fetchIndirectX()
    this.updateAndWrite()
  }

  indirecty = () => {
    this.fetchIndirectY()
    this.updateAndWrite()
  }
}

export { SBC }
