import { Operation } from "./operation.js"

class LSR extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  update = () => {
    this.cpu.flags.C = (this.operand & 0x1)
    this.operand >>>= 1
    this.updateFlags({ n: true, z: true })
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

export { LSR }
