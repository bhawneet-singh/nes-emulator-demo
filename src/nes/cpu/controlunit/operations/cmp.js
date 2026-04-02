import { Operation } from "./operation.js"

class CMP extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateFlags = () => {
    const result = this.cpu.register.A - this.operand
    this.cpu.flags.C = (this.cpu.register.A >= this.operand) ? 1 : 0
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

  zeropagex = () => {
    this.fetchZeroPageX()
    this.updateFlags()
  }

  absolute = () => {
    this.fetchAbsolute()
    this.updateFlags()
  }

  absolutex = () => {
    this.fetchAbsoluteX()
    this.updateFlags()
  }

  absolutey = () => {
    this.fetchAbsoluteY()
    this.updateFlags()
  }

  indirectx = () => {
    this.fetchIndirectX()
    this.updateFlags()
  }

  indirecty = () => {
    this.fetchIndirectY()
    this.updateFlags()
  }
}

export { CMP }
