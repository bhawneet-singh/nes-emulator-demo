import { Operation } from "./operation.js"

class Branch extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  branch = () => {
    const offset = ((this.cpu.bus.read(this.cpu.programCounter++) << 24) >> 24)
    this.cpu.programCounter += offset
  }

  bcc = () => {
    if (!this.cpu.flags.C) {
      this.branch()
    } else {
      this.cpu.programCounter++
    }
  }

  bcs = () => {
    if (this.cpu.flags.C) {
      this.branch()
    } else {
      this.cpu.programCounter++
    }
  }

  beq = () => {
    if (this.cpu.flags.Z) {
      this.branch()
    } else {
      this.cpu.programCounter++
    }
  }

  bmi = () => {
    if (this.cpu.flags.N) {
      this.branch()
    } else {
      this.cpu.programCounter++
    }
  }

  bne = () => {
    if (!this.cpu.flags.Z) {
      this.branch()
    } else {
      this.cpu.programCounter++
    }
  }

  bpl = () => {
    if (!this.cpu.flags.N) {
      this.branch()
    } else {
      this.cpu.programCounter++
    }
  }

  bvc = () => {
    if (!this.cpu.flags.V) {
      this.branch()
    } else {
      this.cpu.programCounter++
    }
  }

  bvs = () => {
    console.log("this", this.cpu.flags.V)
    if (this.cpu.flags.V) {
      this.branch()
    } else {
      this.cpu.programCounter++
    }
  }
}

export { Branch }
