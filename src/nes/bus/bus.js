import { Cartridge } from "../cartridge/cartridge.js"
import { CPU } from "../cpu/6502.js"
import PPU from "../ppu/ppu.js"

class Bus {
  constructor({ cartridge }) {
    this.cartridge = new Cartridge({ buffer: cartridge })
    this.ram = new Uint8Array(2 * 1024).fill(0)
    this.cpu = new CPU({ bus: this })
    this.ppu = new PPU({ bus: this })
    this.controllers = []
    this.shiftRegister = 0x0
    this.strobe = 1
  }

  read = (address) => {
    if (address >= 0x0000 && address <= 0x1fff) {
      return this.ram[address % 0x0800]
    } else if (address >= 0x2000 && (address <= 0x2007)) {
      return this.ppu.read(address)
    } else if (address >= 0x8000 && address <= 0xFFFF) {
      const data = this.cartridge.prgRom[address - 0x8000]
      if (address >= 0xe805 && address <= 0xe810) {
      } else {
      }
      return data
    } else if (address === 0x4016) {
      const data = ((this.shiftRegister & 0x80) > 0) ? 1 : 0
      this.shiftRegister <<= 1
      return data
    }
    return 0
  }

  write = (address, value) => {
    if (address >= 0x0000 && address <= 0x1fff) {
      this.ram[address % 0x0800] = value
    } else if (address >= 2000 && address <= 0x2007) {
      this.ppu.write(address, value)
    } else if (address === 0x4014) {
      this.ppu.dma(address, value)
    } else if (address === 0x4016) {
      this.shiftRegister = (this.controllers[0] || 0)
    } else if (address >= 0x4000 && address <= 0x400B) {
      postMessage({ type: "apu", data: { address, value } })
    }
  }

  getHexString = (number, digit = 4) => {
    return "0x" + number.toString("16").padStart(digit, "0");
  }
}

export { Bus }
