import { Operation } from "./operation.js"

class Stack extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  write = (value) => this.bus.write((this.cpu.stackPointer-- | 0x0100), value)
  read = () => this.bus.read(++this.cpu.stackPointer | 0x0100)

  pha = () => this.write(this.cpu.register.A)
  php = () => {
    const { N, V, un = 1, B = 1, D, I, Z, C } = this.cpu.flags
    let status = ((N << 7) | (V << 6) | (un << 5) | (B << 4) | (D << 3) | (I << 2) | (Z << 1) | C)
    this.write(status)
  }

  pla = () => {
    this.operand = this.read()
    this.updateFlags({ n: true, z: true })
    this.writeRegisterA()
  }

  plp = () => {
    const status = this.read();
    this.cpu.flags.N = (status >> 7) & 1;
    this.cpu.flags.V = (status >> 6) & 1;
    this.cpu.flags.D = (status >> 3) & 1;
    this.cpu.flags.I = (status >> 2) & 1;
    this.cpu.flags.Z = (status >> 1) & 1;
    this.cpu.flags.C = status & 1;
  }

  jsr = () => {
    this.fetchAbsolute(false)
    const returnAddress = this.cpu.programCounter - 1
    const high = (returnAddress & 0xff00) >> 8
    const low = returnAddress & 0x00ff
    this.write(high)
    this.write(low)
    this.cpu.programCounter = this.address
  }

  //NOTE: nmi is not a instruction
  nmi = () => {
    const returnAddress = this.cpu.programCounter
    const high = (returnAddress & 0xff00) >> 8
    const low = returnAddress & 0x00ff
    this.write(high)
    this.write(low)
    this.php()
    this.cpu.programCounter = this.cpu.nmiVector
  }

  rti = () => {
    this.plp()
    const low = this.read()
    const high = this.read()
    this.cpu.programCounter = ((high << 8) | low)
  }

  rts = () => {
    const low = this.read()
    const high = this.read()
    this.cpu.programCounter = ((high << 8) | low) + 1
  }
}

export { Stack }
