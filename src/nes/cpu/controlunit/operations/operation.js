class Operation {
  constructor({ cpu }) {
    this.cpu = cpu
    this.bus = cpu.bus
  }

  fetchAccumulator = () => {
    this.operand = this.cpu.register.A
  }

  fetchImmediate = () => {
    this.operand = this.bus.read(this.cpu.programCounter++)
  }

  fetchZeroPage = (read = true) => {
    this.address = this.bus.read(this.cpu.programCounter++)
    read && (this.operand = this.bus.read(this.address))
  }

  fetchZeroPageX = (read = true) => {
    this.address = ((this.bus.read(this.cpu.programCounter++) + this.cpu.register.X) & 0xff)
    read && (this.operand = this.bus.read(this.address))
  }

  fetchZeroPageY = (read = true) => {
    this.address = ((this.bus.read(this.cpu.programCounter++) + this.cpu.register.Y) & 0xff)
    read && (this.operand = this.bus.read(this.address))
  }

  fetchAbsolute = (read = true) => {
    const low = this.bus.read(this.cpu.programCounter++)
    const high = this.bus.read(this.cpu.programCounter++)
    this.address = ((high << 8) | low)
    read && (this.operand = this.bus.read(this.address))
  }

  fetchAbsoluteX = (read = true) => {
    const low = this.bus.read(this.cpu.programCounter++)
    const high = this.bus.read(this.cpu.programCounter++)
    this.address = ((((high << 8) | low) + this.cpu.register.X) & 0xffff)
    read && (this.operand = this.bus.read(this.address))
  }

  fetchAbsoluteY = (read = true) => {
    const low = this.bus.read(this.cpu.programCounter++)
    const high = this.bus.read(this.cpu.programCounter++)
    this.address = ((((high << 8) | low) + this.cpu.register.Y) & 0xffff)
    read && (this.operand = this.bus.read(this.address))
  }

  fetchIndirectX = (read = true) => {
    const pointerAddress = this.bus.read(this.cpu.programCounter++)
    let byteLocation = (pointerAddress % 256) + this.cpu.register.X
    const low = this.bus.read(byteLocation++)
    const high = this.bus.read(byteLocation & 0xff)
    this.address = ((high << 8) | low)
    read && (this.operand = this.bus.read(this.address))
  }

  fetchIndirectY = (read = true) => {
    const pointerAddress = this.bus.read(this.cpu.programCounter++)
    let byteLocation = pointerAddress % 256
    const low = this.bus.read(byteLocation++)
    const high = this.bus.read(byteLocation & 0xff)
    this.address = ((((high << 8) | low) + this.cpu.register.Y) & 0xffff)
    read && (this.operand = this.bus.read(this.address))
  }

  writeRegisterA = () => this.cpu.register.A = this.operand
  writeRegisterX = () => this.cpu.register.X = this.operand
  writeRegisterY = () => this.cpu.register.Y = this.operand
  writeAtAddress = () => this.cpu.bus.write(this.address, this.operand)

  updateFlags = ({ n, z, c, i, d, v }) => {
    if (c) {
      if (this.operand > 255) {
        this.cpu.flags.C = 1
        this.operand &= 0xFF
      } else {
        this.cpu.flags.C = 0
      }
    }
    if (n)
      this.cpu.flags.N = (this.operand & 0x80) ? 1 : 0
    if (z)
      this.cpu.flags.Z = (this.operand === 0) ? 1 : 0
  }
}

export { Operation }
