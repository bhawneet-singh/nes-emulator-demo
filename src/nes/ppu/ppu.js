class LoopyRegister {
  coarseX = 0
  coarseY = 0
  fineY = 0
  nametableX = 0
  nametableY = 0
  reg = 0
}

const masterPalette = [
  { r: 124, g: 124, b: 124 }, { r: 0, g: 0, b: 252 }, { r: 0, g: 0, b: 188 }, { r: 68, g: 40, b: 188 },
  { r: 148, g: 0, b: 132 }, { r: 168, g: 0, b: 32 }, { r: 168, g: 16, b: 0 }, { r: 136, g: 20, b: 0 },
  { r: 80, g: 48, b: 0 }, { r: 0, g: 120, b: 0 }, { r: 0, g: 104, b: 0 }, { r: 0, g: 88, b: 0 },
  { r: 0, g: 64, b: 88 }, { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 },
  { r: 188, g: 188, b: 188 }, { r: 0, g: 120, b: 248 }, { r: 0, g: 88, b: 248 }, { r: 104, g: 68, b: 252 },
  { r: 216, g: 0, b: 204 }, { r: 228, g: 0, b: 88 }, { r: 248, g: 56, b: 0 }, { r: 228, g: 92, b: 16 },
  { r: 172, g: 124, b: 0 }, { r: 0, g: 184, b: 0 }, { r: 0, g: 168, b: 0 }, { r: 0, g: 168, b: 68 },
  { r: 0, g: 136, b: 136 }, { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 },
  { r: 248, g: 248, b: 248 }, { r: 60, g: 188, b: 252 }, { r: 104, g: 136, b: 252 }, { r: 152, g: 120, b: 248 },
  { r: 248, g: 120, b: 248 }, { r: 248, g: 88, b: 152 }, { r: 248, g: 120, b: 88 }, { r: 252, g: 160, b: 68 },
  { r: 248, g: 184, b: 0 }, { r: 184, g: 248, b: 24 }, { r: 88, g: 216, b: 84 }, { r: 88, g: 248, b: 152 },
  { r: 0, g: 232, b: 216 }, { r: 120, g: 120, b: 120 }, { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 },
  { r: 252, g: 252, b: 252 }, { r: 164, g: 228, b: 252 }, { r: 184, g: 184, b: 248 }, { r: 216, g: 184, b: 248 },
  { r: 248, g: 184, b: 248 }, { r: 248, g: 164, b: 192 }, { r: 240, g: 208, b: 176 }, { r: 252, g: 224, b: 168 },
  { r: 248, g: 216, b: 120 }, { r: 216, g: 248, b: 120 }, { r: 184, g: 248, b: 184 }, { r: 184, g: 248, b: 216 },
  { r: 0, g: 252, b: 252 }, { r: 248, g: 216, b: 248 }, { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }
]

class Ppu {
  register = {
    control: {
      nmi: 0,
      spriteSize: 0,
      backgroundTable: 0,
      spriteTable: 0,
      vRamInc: 0,
    },
    status: 0,
    mask: {
      emBlue: 0,
      emGreen: 0,
      emRed: 0,
      sprites: 0,
      background: 0,
      leftSprite: 0,
      leftBackground: 0,
      greyscale: 0
    },
    t: new LoopyRegister(),
    v: new LoopyRegister(),
    fineX: 0,
    w: 0,
    n: 0
  }
  nmi = 0

  nextTileIndex = 0
  nextTileAttributeLow = 0
  nextTileAttributeHigh = 0

  nextTileBgLow = 0
  nextTileBgHigh = 0

  shiftRegister = {
    bgShiftRegisterHigh: 0,
    bgShiftRegisterLow: 0,
    attributeShiftRegisterLow: 0,
    attributeShiftRegisterHigh: 0
  }

  oamShiftRegisters = {
    lowBitShiftRegisters: new Array(8),
    highBitShiftRegisters: new Array(8)
  }

  spriteCount = 0

  ppuDataBuffer = 0

  constructor({ bus }) {
    this.bus = bus
    this.counter = 0
    this.scanline = 0
    this.nametables = Array.from({ length: 1024 * 2 }, () => 0)
    this.paletteMemory = Array.from({ length: 32 }, () => 0)
    this.oamMemory = Array.from({ length: 256 }, () => 0)
    // this.framebuffer = new Uint8ClampedArray({ length: 256 * 240 * 4 })

    this.secondaryOam = Array.from({ length: 8 }, () => 0)
  }

  write(address, value) {
    switch (address) {
      case 0x2000:
        this.register.control.nmi = (value >>> 7)
        this.register.control.spriteSize = ((value >>> 6) & 0x1)
        this.register.control.backgroundTable = ((value >>> 4) & 0x1)
        this.register.control.spriteTable = ((value >>> 3) & 0x1)
        this.register.control.vRamInc = (((value) >>> 2) & 0x1)
        const nametable = (value & 0x03)
        this.register.t.nametableX = (nametable & 0b1)
        this.register.t.nametableY = ((nametable >> 1) & 0b1)
        break
      case 0x2001:
        this.register.mask.emBlue = (value >>> 7)
        this.register.mask.emGreen = ((value >>> 6) & 0x1)
        this.register.mask.emRed = ((value >>> 5) & 0x1)
        this.register.mask.sprites = ((value >>> 4) & 0x1)
        this.register.mask.background = ((value >>> 3) & 0x1)
        this.register.mask.leftSprite = ((value >>> 2) & 0x1)
        this.register.mask.leftBackground = ((value >>> 1) & 0x1)
        this.register.mask.greyscale = (value & 0x1)
        break
      case 0x2002:
        break;
      case 0x2005:
        if (!this.register.w) {
          this.register.fineX = (value & 0x07)
          this.register.t.coarseX = ((value & 0xf8) >>> 3)
          this.register.w = 1
        } else {
          this.register.t.fineY = (value & 0x07)
          this.register.t.coarseY = ((value & 0xf8) >>> 3)
          this.register.w = 0
        }
        break
      case 0x2006:
        if (!this.register.w) {
          this.register.t.reg = value
          this.register.w = 1
        } else {
          this.register.t.reg = ((this.register.t.reg << 8) | value)
          this.register.v.reg = this.register.t.reg
          this.register.w = 0
        }
        break
      case 0x2007:
        if (this.register.v.reg >= 0x2000 && this.register.v.reg <= 0x27FF) {
          this.nametables[this.register.v.reg - 0x2000] = value
          this.register.v.reg += (this.register.control.vRamInc ? 32 : 1)
        } else if (this.register.v.reg >= 0x3f00 && this.register.v.reg <= 0x3f1f) {
          const address = (this.register.v.reg - 0x3f00)
          this.register.v.reg += (this.register.control.vRamInc ? 32 : 1)
          this.paletteMemory[address] = value
          postMessage({ type: "palette", data: this.paletteMemory })
        }
        break
    }
  }

  read(address) {
    switch (address) {
      case 0x2002:
        const status = this.register.status
        this.register.status &= (~0x80)
        this.register.w = 0
        return status
      case 0x2007:
        const address = this.register.v.reg
        this.register.v.reg += (this.register.control.vRamInc ? 32 : 1)
        let data = this.ppuDataBuffer
        if (address <= 0x2000) {
          this.ppuDataBuffer = this.bus.cartridge.chrRom[address]
        } else {
          data = this.ppuDataBuffer
        }
        return data
    }
    return 0xff;
  }

  dma(_, value) {
    const pageLocation = (value << 8)
    for (let i = 0; i < 256; i++) {
      const data = this.bus.read(pageLocation + i)
      this.oamMemory[i] = data
    }
    postMessage({ type: "oam", data: this.oamMemory })
  }

  populateShiftRegister() {
    this.shiftRegister.bgShiftRegisterLow = ((this.shiftRegister.bgShiftRegisterLow & 0xff00) | this.nextTileBgLow)
    this.shiftRegister.bgShiftRegisterHigh = ((this.shiftRegister.bgShiftRegisterHigh & 0xff00) | this.nextTileBgHigh)

    this.shiftRegister.attributeShiftRegisterLow = ((this.shiftRegister.attributeShiftRegisterLow & 0xff00) | (this.nextTileAttributeLow ? 0xff : 0x00))
    this.shiftRegister.attributeShiftRegisterHigh = ((this.shiftRegister.attributeShiftRegisterHigh & 0xff00) | (this.nextTileAttributeHigh ? 0xff : 0x00))
  }

  incrementCoarseX() {
    if (this.register.mask.sprites || this.register.mask.background) {
      if (this.register.v.coarseX === 31) {
        this.register.v.coarseX = 0
        this.register.v.nametableX = (!this.register.v.nametableX & 0x1)
      } else {
        this.register.v.coarseX++
      }
    }
  }

  incrementCoarseY() {
    if (this.register.mask.sprites || this.register.mask.background) {
      if (this.register.v.fineY < 7) {
        this.register.v.fineY++
      } else {
        this.register.v.fineY = 0
        if (this.register.v.coarseY === 29) {
          this.register.v.coarseY = 0
        } else {
          this.register.v.coarseY++
        }
      }
    }
  }

  transferX() {
    if (this.register.mask.sprites || this.register.mask.background) {
      this.register.v.coarseX = this.register.t.coarseX
      this.register.v.nametableX = this.register.t.nametableX
    }
  }

  transferY() {
    if (this.register.mask.sprites || this.register.mask.background) {
      this.register.v.coarseY = this.register.t.coarseY
      this.register.v.fineY = this.register.t.fineY
    }
  }

  updateShifter() {
    if (this.register.mask.sprites || this.register.mask.background) {
      this.shiftRegister.bgShiftRegisterLow <<= 1
      this.shiftRegister.bgShiftRegisterHigh <<= 1

      this.shiftRegister.attributeShiftRegisterLow <<= 1
      this.shiftRegister.attributeShiftRegisterHigh <<= 1
    }

    if (this.register.mask.sprites && this.counter > 1 && this.counter < 258) {
      for (let i = 0; i < this.spriteCount; i++) {
        if (this.secondaryOam[i].x > 0) {
          this.secondaryOam[i].x--
        } else {
          this.oamShiftRegisters.lowBitShiftRegisters[i] <<= 1
          this.oamShiftRegisters.highBitShiftRegisters[i] <<= 1
        }
      }
    }
  }


  loadAttributeBits() {
    if (this.register.mask.sprites || this.register.mask.background) {
      const x = parseInt(this.register.v.coarseX / 4)
      const y = parseInt(this.register.v.coarseY / 4)
      let attributeByte = this.nametables[(this.register.v.nametableX * 1024) + 960 + (y * 8) + x]

      const tileX = (this.register.v.coarseX % 4)
      const tileY = (this.register.v.coarseY % 4)

      if (tileX < 2) {
        if (tileY > 1) {
          attributeByte >>= 4
        }
      } else {
        if (tileY < 2) {
          attributeByte >>= 2
        } else {
          attributeByte >>= 6
        }
      }

      this.nextTileAttributeLow = (attributeByte & 0b01)
      this.nextTileAttributeHigh = (attributeByte & 0b10)
    }
  }

  fetchBgPixelData() {
    this.updateShifter()
    switch ((this.counter - 1) % 8) {
      case 0:
        this.populateShiftRegister()
        this.nextTileIndex = this.nametables[((1024 * this.register.v.nametableX) + (this.register.v.coarseY * 32) + this.register.v.coarseX)]
        break;
      case 3:
        this.loadAttributeBits()
        break;
      case 5:
        this.nextTileBgLow = this.bus.cartridge.chrRom[(this.register.control.backgroundTable * 4096) + (this.nextTileIndex * 16) + this.register.v.fineY]
        break
      case 6:
        this.nextTileBgHigh = this.bus.cartridge.chrRom[(this.register.control.backgroundTable * 4096) + (this.nextTileIndex * 16) + 8 + this.register.v.fineY]
        break
      case 7:
        this.incrementCoarseX()
        break
    }
  }

  spriteClear() {
    for (let i = 0; i < this.spriteCount; i++) {
      this.secondaryOam[i] = null
    }
    this.spriteCount = 0
  }

  flipbyte(b) {
    b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
    b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
    b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
    return b & 0xff;
  }

  spriteEval() {
    for (let i = 0; i < 64; i++) {
      const idx = (i * 4)
      const y = this.oamMemory[idx]
      const x = this.oamMemory[idx + 3]
      const tileIdx = this.oamMemory[idx + 1]
      const attr = this.oamMemory[idx + 2]

      if (this.scanline >= y && this.scanline < (y + 8) && this.spriteCount < 8) {
        this.secondaryOam[this.spriteCount] = { x, y, tileIdx, attr }
        let patternTableAddress

        const row = this.scanline - y

        if (attr & 0x80) {
          patternTableAddress = (((this.register.control.spriteTable) * 4096) + (tileIdx * 16) + (7 - row))
        } else {
          patternTableAddress = ((this.register.control.spriteTable) * 4096) + (tileIdx * 16) + row
        }
        let high = this.bus.cartridge.chrRom[patternTableAddress + 8]
        let low = this.bus.cartridge.chrRom[patternTableAddress]

        if (attr & 0x40) {
          high = this.flipbyte(high)
          low = this.flipbyte(low)
        }

        this.oamShiftRegisters.lowBitShiftRegisters[this.spriteCount] = low
        this.oamShiftRegisters.highBitShiftRegisters[this.spriteCount++] = high
      }

      // if(count >= 8)
      // this is for sprite overflow
    }
  }


  clock() {
    this.counter++
    this.last = 0

    if (this.scanline > 0 && this.scanline < 241) {
      if (this.counter > 0 && this.counter < 257) {
        this.fetchBgPixelData()
        if (this.register.mask.background) {
          if (this.scanline === 31) {
            this.register.status |= 0x40 // clear sprite 0 hit at frame start
          }
          const curPixel = (0x8000 >> this.register.fineX)
          const highBit = ((this.shiftRegister.bgShiftRegisterHigh & curPixel) ? 1 : 0)
          const lowBit = ((this.shiftRegister.bgShiftRegisterLow & curPixel) ? 1 : 0)

          const bgPixel = ((highBit << 1) | lowBit)

          const highBitAttr = ((this.shiftRegister.attributeShiftRegisterHigh & curPixel) ? 1 : 0)
          const lowBitAttr = ((this.shiftRegister.attributeShiftRegisterLow & curPixel) ? 1 : 0)

          const bgPallete = ((highBitAttr << 1) | lowBitAttr)

          //foreground
          let fgPixel = 0
          let fgPallete
          let fgPriority
          for (let i = 0; i < this.spriteCount; i++) {
            if (this.secondaryOam[i].x === 0) {
              const highBit = ((this.oamShiftRegisters.highBitShiftRegisters[i] & 0x80) > 0)
              const lowBit = ((this.oamShiftRegisters.lowBitShiftRegisters[i] & 0x80) > 0)
              fgPixel = ((highBit << 1) | lowBit)
              fgPallete = (this.secondaryOam[i].attr & 0x03) + 0x04
              fgPriority = ((this.secondaryOam[i].attr & 0x20) === 0)

              if (fgPixel !== 0) {
                break
              }
            }
          }

          let palette = 0
          let pixel = 0

          if (bgPixel === 0 && fgPixel === 0) {
            pixel = 0x00
            palette = 0x00
          } else if (bgPixel === 0 && fgPixel > 0) {
            pixel = fgPixel
            palette = fgPallete
          } else if (bgPixel > 0 && fgPixel === 0) {
            pixel = bgPixel
            palette = bgPallete
          } else if (bgPixel > 0 && fgPixel > 0) {
            if (fgPriority) {
              pixel = fgPixel
              palette = fgPallete
            } else {
              pixel = bgPixel
              palette = bgPallete
            }
          }

          let colorIdx = 0
          if (pixel === 0) {
            colorIdx = this.paletteMemory[16]
          } else {
            colorIdx = this.paletteMemory[(palette * 4) + pixel]
          }

          const color = masterPalette[colorIdx]

          const y = this.scanline - 1
          const x = this.counter - 1

          const yIdx = (y * 256 * 4)
          const xIdx = x * 4

          this.framebuffer[yIdx + xIdx + 0] = color.r
          this.framebuffer[yIdx + xIdx + 1] = color.g
          this.framebuffer[yIdx + xIdx + 2] = color.b
          this.framebuffer[yIdx + xIdx + 3] = 255
        }
      }
    }

    if (this.scanline > 0 && this.counter === 257) {
      this.incrementCoarseY()
      // this.register.status &= (~0x80)
    }


    if (this.scanline === 0)
      this.transferY()

    if (this.counter === 258) {
      this.transferX()
    }

    if (this.scanline >= 0 && this.scanline < 240) {
      if (this.counter === 258)
        this.spriteClear()

      if (this.counter === 259)
        this.spriteEval()
    }

    if (this.counter > 320 && this.counter < 337) {
      this.fetchBgPixelData()
    }

    if (this.scanline === 261 && this.counter === 1) {
      this.register.status &= ~0x40; // clear sprite 0 hit at frame start
    }

    if (this.scanline === 241 && this.counter === 1) {
      if (this.register.control.nmi) {
        this.bus.cpu.triggerNMI()
        this.nmi++
      }

      this.transferY()
      this.register.status |= 0x80

      // if ((performance.now() - this.last) > 50) {
      //   postMessage({ type: "display", data: this.framebuffer })
      // }
    }

    if (this.counter === 341) {
      this.counter = 0
      this.scanline++

      if (this.scanline >= 262) {
        this.register.t.nametableX = 0
        this.register.v.nametableX = 0
        this.scanline = 0
      }
    }
  }
}

export default Ppu
