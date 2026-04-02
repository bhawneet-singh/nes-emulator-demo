import { Operation } from "./operation.js"

class ASL extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  update = () => {
    this.operand <<= 1
    this.updateFlags({ n: true, z: true, c: true })
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

export { ASL }
