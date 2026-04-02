import { Operation } from "./operation.js"

class JMP extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  absolute = () => {
    const low = this.cpu.bus.read(this.cpu.programCounter++)
    const high = this.cpu.bus.read(this.cpu.programCounter++)
    const address = (high << 8) | low
    this.cpu.programCounter = address
  }

  indirect = () => {
    let low = this.cpu.bus.read(this.cpu.programCounter++)
    const high = this.cpu.bus.read(this.cpu.programCounter++)
    // const address = (high << 8) | low
    let operandLow = this.cpu.bus.read((high << 8) | (low++))
    let operandHigh = this.cpu.bus.read((high << 8) | (low & 0xff))
    this.cpu.programCounter = (operandHigh << 8) | operandLow
  }
}

export { JMP }
