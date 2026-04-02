import { Operation } from "./operation.js"

class STA extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    this.operand = this.cpu.register.A
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

  absolutex = () => {
    this.fetchAbsoluteX(false)
    this.updateAndWrite()
  }

  absolutey = () => {
    this.fetchAbsoluteY(false)
    this.updateAndWrite()
  }

  indirectx = () => {
    this.fetchIndirectX(false)
    this.updateAndWrite()
  }

  indirecty = () => {
    this.fetchIndirectY(false)
    this.updateAndWrite()
  }
}

export { STA }
