import { Operation } from "./operation.js"

class AND extends Operation {
  constructor({ cpu }) {
    super({ cpu })
  }

  updateAndWrite = () => {
    this.operand &= this.cpu.register.A
    this.updateFlags({ n: true, z: true })
    this.writeRegisterA()
  }

  immediate = () => {
    this.fetchImmediate()
    this.updateAndWrite()
  }

  zeropage = () => {
    this.fetchZeroPage()
    this.updateAndWrite()
  }

  zeropagex = () => {
    this.fetchZeroPageX()
    this.updateAndWrite()
  }

  absolute = () => {
    this.fetchAbsolute()
    this.updateAndWrite()
  }

  absolutex = () => {
    this.fetchAbsoluteX()
    this.updateAndWrite()
  }

  absolutey = () => {
    this.fetchAbsoluteY()
    this.updateAndWrite()
  }

  indirectx = () => {
    this.fetchIndirectX()
    this.updateAndWrite()
  }

  indirecty = () => {
    this.fetchIndirectY()
    this.updateAndWrite()
  }
}

export { AND }
