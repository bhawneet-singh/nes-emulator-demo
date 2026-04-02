import { Operation } from "./operation.js"

class INC extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    this.operand += 1
    if (this.operand > 255)
      this.operand = 0
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

  inx = () => {
    this.cpu.register.X = ((this.cpu.register.X + 1) & 0xff)
    this.operand = this.cpu.register.X
    this.updateFlags({ n: true, z: true })
  }

  iny = () => {
    this.cpu.register.Y = ((this.cpu.register.Y + 1) & 0xff)
    this.operand = this.cpu.register.Y
    this.updateFlags({ n: true, z: true })
  }
}

export { INC }

