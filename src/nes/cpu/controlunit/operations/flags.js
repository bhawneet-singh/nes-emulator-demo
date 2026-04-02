import { Operation } from "./operation.js"

class Flags extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  sec = () => this.cpu.flags.C = 1
  sed = () => this.cpu.flags.D = 1
  sei = () => this.cpu.flags.I = 1

  clc = () => this.cpu.flags.C = 0
  cld = () => this.cpu.flags.D = 0
  cli = () => this.cpu.flags.I = 0
  clv = () => this.cpu.flags.V = 0
}

export { Flags }
