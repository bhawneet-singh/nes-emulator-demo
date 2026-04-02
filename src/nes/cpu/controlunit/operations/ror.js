import { Operation } from "./operation.js"

class ROR extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  update = () => {
    this.operand = (((this.operand & 0b1) << 8) | ((this.operand >> 1) | (this.cpu.flags.C << 7)))
    this.updateFlags({ n: true, z: true, c: true }) // this hack for donkey kong
  }

  accumulator = () => {
    this.fetchAccumulator()
    this.update()
    this.writeRegisterA()
  }

  zeropage = () => {
    this.fetchZeroPage()
    this.update()
    this.writeAtAddress()
  }

  zeropagex = () => {
    this.fetchZeroPageX()
    this.update()
    this.writeAtAddress()
  }

  absolute = () => {
    this.fetchAbsolute()
    this.update()
    this.writeAtAddress()
  }

  absolutex = () => {
    this.fetchAbsoluteX()
    this.update()
    this.writeAtAddress()
  }
}

export { ROR }
