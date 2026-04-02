class RomReader extends DataView {
  constructor({ buffer }) {
    super(buffer)
    this.name = new TextDecoder().decode(new Uint8Array(this.buffer).slice(0, 3))
    this.prgRomBanks = this.getUint8(4)
    this.chrRomBanks = this.getUint8(5)
    this.ctrlByteOne = this.getUint8(6)
    this.ctrlByteTwo = this.getUint8(7)
    this.prgRamSize = this.getUint8(8) || 1
    this.prgRomSize = this.prgRomBanks * 16 * 1024
    this.chrRomSize = this.chrRomBanks * 8 * 1024
    this.trainer = (this.ctrlByteOne & 0x40)
    this.prgStart = (this.trainer ? 512 : 16)
    this.prgEnd = (this.prgStart + this.prgRomSize)
    this.chrStart = this.prgEnd
    this.chrEnd = (this.chrStart + this.chrRomSize)

    this.mapper = ((this.ctrlByteTwo >> 4) << 4) | (this.ctrlByteOne >> 4);
  }

  get prgData() {
    return new Uint8Array(this.buffer).slice(this.prgStart, this.prgEnd)
  }

  get chrData() {
    return new Uint8Array(this.buffer).slice(this.chrStart, this.chrEnd)
  }
}

class Cartridge {
  constructor({ buffer }) {
    const romReader = new RomReader({ buffer })
    if (romReader.name !== "NES") {
      throw Error("Unkown File Format")
    }

    this.prgRom = romReader.prgData
    this.chrRom = romReader.chrData

    console.log("mapper", romReader.mapper)
    if (romReader.prgRomBanks === 1) {
      this.prgRom = [...this.prgRom, ...this.prgRom]
    }

    this.irqVector = (this.prgRom[this.prgRom.length - 1] << 8 | this.prgRom[this.prgRom.length - 2])
    this.resetVector = (this.prgRom[this.prgRom.length - 3] << 8 | this.prgRom[this.prgRom.length - 4])
    this.nmiVector = (this.prgRom[this.prgRom.length - 5] << 8 | this.prgRom[this.prgRom.length - 6])
  }
}

export { Cartridge }
