import { ControlUnit } from "./controlunit/controlunit.js"

class CPU {
  constructor({ bus }) {
    this.bus = bus
    this.programCounter = 0
    this.stackPointer = 0
    this.flags = { N: 0, Z: 0, C: 0, I: 0, D: 0, V: 0 }
    this.register = {
      A: 0,
      X: 0,
      Y: 0,
      instructionRegister: 0
    }

    this.controlunit = new ControlUnit({ cpu: this })
    this.nmi = false

    this.irqVector = this.bus.cartridge.irqVector
    this.resetVector = this.bus.cartridge.resetVector
    this.nmiVector = this.bus.cartridge.nmiVector

    this.programCounter = this.resetVector
  }

  triggerNMI = () => this.nmi = true

  clock = () => {
    this.fetch(); this.controlunit.decode(); this.controlunit.execute();
    if (this.nmi) {
      this.nmi = false
      this.controlunit.operations.stack.nmi()
    }

    return this.controlunit.operation?.cycles || 7
  }

  fetch = () => this.register.instructionRegister = this.bus.read(this.programCounter++)
}

export { CPU }
