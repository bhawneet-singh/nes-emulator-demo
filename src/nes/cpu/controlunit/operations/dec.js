import { Operation } from "./operation.js"

class DEC extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    this.operand -= 1
    this.updateFlags({ n: true, z: true })
    this.writeAtAddress()
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

  dex = () => {
    this.cpu.register.X = ((this.cpu.register.X + 0xff) & 0xff)
    this.operand = this.cpu.register.X
    this.updateFlags({ n: true, z: true })
  }

  dey = () => {
    this.cpu.register.Y = ((this.cpu.register.Y + 0xff) & 0xff)
    this.operand = this.cpu.register.Y
    this.updateFlags({ n: true, z: true })
  }
}

export { DEC }

