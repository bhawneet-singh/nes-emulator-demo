import { Operation } from "./operation.js"

class Transfer extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  tax = () => {
    this.operand = this.cpu.register.A
    this.updateFlags({ n: true, z: true })
    this.writeRegisterX()
  }

  tay = () => {
    this.operand = this.cpu.register.A
    this.updateFlags({ n: true, z: true })
    this.writeRegisterY()
  }

  tsx = () => {
    this.operand = this.cpu.stackPointer
    this.updateFlags({ n: true, z: true })
    this.writeRegisterX()
  }

  txa = () => {
    this.operand = this.cpu.register.X
    this.updateFlags({ n: true, z: true })
    this.writeRegisterA()
  }

  txs = () => {
    this.operand = this.cpu.register.X
    // this.updateFlags({ n: true, z: true })
    this.cpu.stackPointer = this.operand
  }

  tya = () => {
    this.operand = this.cpu.register.Y
    this.updateFlags({ n: true, z: true })
    this.writeRegisterA()
  }
}

export { Transfer }
