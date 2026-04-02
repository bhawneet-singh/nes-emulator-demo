class Visualizer {
  constructor({ analyser, visualize }) {
    if (!visualize)
      return
    this.visualize = visualize
    this.canvas = document.getElementById(visualize)
    this.ctx = this.canvas.getContext("2d")

    const scale = window.devicePixelRatio
    this.canvas.width = this.canvas.clientWidth * scale
    this.canvas.height = this.canvas.clientHeight * scale

    this.analyser = analyser
    this.dataArray = new Uint8Array(analyser.frequencyBinCount)
    this.draw = this.draw.bind(this)
  }

  draw() {
    if (!this.visualize)
      return
    requestAnimationFrame(this.draw)
    this.analyser.getByteTimeDomainData(this.dataArray)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.beginPath()
    this.ctx.strokeStyle = "#B0B0B0"
    this.ctx.lineWidth = 2

    const centerY = this.canvas.height / 2
    const amplitude = this.canvas.height / 3

    const startIdx = this.findZeroCrossing()
    const sliceWidth = this.canvas.width / this.dataArray.length
    let x = 0

    for (let i = 0; i < this.dataArray.length; i++) {
      const idx = (startIdx + i) % this.dataArray.length
      const normalized = (this.dataArray[idx] - 128) / 128
      const y = centerY + normalized * amplitude

      if (i === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
      x += sliceWidth
    }

    this.ctx.stroke()
  }

  findZeroCrossing() {
    for (let i = 1; i < this.dataArray.length; i++) {
      if (this.dataArray[i - 1] < 128 && this.dataArray[i] >= 128) {
        return i
      }
    }
    return 0
  }
}

class FrameCounter {
  constructor() {
    this.frame = 0
    this.onTick = null
    this.timer = null
  }

  start() {
    if (this.timer && this.onTick) return
    this.timer = setInterval(() => {
      this.frame = (this.frame + 1) % 4
      this.onTick({ frame: this.frame + 1 })
    }, 1000 / 240)
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
}

let apu = null

export const initApu = async () => {
  if (!apu)
    apu = new APU()
}

export const volume = (value) => {
  if (apu)
    apu.master.gain.setValueAtTime(value, apu.audioctx.currentTime)
}

export const writeRegister = ({ address, value }) => {
  apu.write({ address, value })
}

class APU {
  constructor() {
    this.audioctx = new AudioContext()
    this.pulseOne = new PulseWave({ audioctx: this.audioctx, index: 0, visualize: "channel-1" })
    this.pulseTwo = new PulseWave({ audioctx: this.audioctx, index: 1, visualize: "channel-2" })
    this.triangleWave = new TriangleWave({ audioctx: this.audioctx, visualize: "channel-3" })

    this.master = this.audioctx.createGain()

    this.pulseOne.connect(this.master)
    this.pulseTwo.connect(this.master)
    this.triangleWave.connect(this.master)

    this.master.connect(this.audioctx.destination)

    this.master.gain.setValueAtTime(0.5, this.audioctx.currentTime)
    this.initFrameCounter()
  }

  write(value) {
    this.pulseOne.write(value)
    this.pulseTwo.write(value)
    this.triangleWave.write(value)
  }

  initFrameCounter() {
    this.frameCounter = new FrameCounter()
    this.frameCounter.onTick = (e) => {
      this.pulseOne.tick(e)
      this.pulseTwo.tick(e)
      this.triangleWave.tick(e)
    }
    this.frameCounter.start()
  }
}

class PulseWave extends Visualizer {
  lengthTable = [
    10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14,
    12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30
  ]
  dutyCycleTable = [.12, .25, .50, .68]
  registerMap = {
    0x4000: this.writeFirstByte,
    0x4004: this.writeFirstByte,
    0x4001: this.writeSecondByte,
    0x4005: this.writeSecondByte,
    0x4002: this.writeThirdByte,
    0x4006: this.writeThirdByte,
    0x4003: this.writeFourthByte,
    0x4007: this.writeFourthByte,
  }

  constructor({ audioctx, visualize = false, index }) {
    const analyser = audioctx.createAnalyser()
    super({ analyser, visualize })
    this.analyser = analyser
    this.audioctx = audioctx
    this.index = index
    this.osc = audioctx.createOscillator()
    this.gain = audioctx.createGain()

    this.analyser.fftSize = 1024
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    this.osc.type = "sawtooth"
    this.osc.frequency.value = 0

    this.waveShaper = this.audioctx.createWaveShaper();
    this.waveShaper.curve = this.createDutyCycleCurve(0.50);
    this.waveShaper.oversample = '4x'

    this.osc.connect(this.waveShaper)
    this.waveShaper.connect(this.gain)
    this.gain.connect(this.analyser)

    this.setVolume(0)
    this.osc.start()
    this.draw()

    this.count = 0
    this.envelopeCounter = 0
    this.sweepCounter = 0
    this.volume = 0
    this.frequency = 0
    this.timer = { high: 0, low: 0 }
  }

  async write({ address, value }) {
    if ((this.index === 0 && address < 0x4004) || (this.index === 1 && address > 0x4003) && address < 0x4008) {
      this.registerMap[address].bind(this)(value)
      this.setDutyCycle(this.dutyCycleTable[this.dutyCycle])
      this.setVolume(this.volume / 15)
      this.calcFrequency()
      this.setFrequency(this.frequency)
    }
  }

  writeFirstByte(value) {
    this.dutyCycle = ((value & 0xc0) >> 6)
    this.lengthCounterHalt = ((value & 0x20) >> 5)
    this.constantVE = ((value & 0x10) >> 4)
    this.VEDivider = (value & 0x0f)
    this.volume = this.VEDivider
  }

  writeSecondByte(value) {
    this.sweepEnable = ((value & 0x80) >>> 7)
    this.sweepPeriod = ((value & 0x70) >>> 4)
    this.negateMode = ((value & 0x08) >>> 3)
    this.shiftCount = (value & 0x7)
  }

  writeThirdByte(value) {
    this.timer.low = value
  }

  writeFourthByte(value) {
    this.lengthCounterValue = ((value & 0xf8) >>> 3)
    this.count = this.lengthTable[this.lengthCounterValue]
    this.timer.high = value & 0x7
  }

  async tick({ frame }) {
    if ((frame & 1) === 0) {
      this.lengthCounter()
      this.sweep()
    }
    this.envelope()
  }

  calcFrequency() {
    const time = ((this.timer.high << 8) | this.timer.low)
    this.frequency = 1789773 / (16 * (time + 1))
    if (this.frequency > 12400)
      this.frequency = 12400
  }

  async sweep() {
    if (this.sweepEnable) {
      this.sweepCounter++
      if (this.sweepCounter > (this.sweepPeriod + 1)) {
        this.sweepCounter = 0
        let time = ((this.timer.high << 8) | this.timer.low)
        const shift = time >>> this.shiftCount
        if (this.negateMode) {
          time = (time - (shift > 0 ? shift : 0))
        } else {
          time = (time + (shift > 0 ? shift : 0))
        }
        this.timer.high = ((time & 0x700) >>> 8)
        this.timer.low = (time & 0xff)
        this.calcFrequency()
        this.setFrequency(this.frequency)
      }
    }
  }

  async envelope() {
    if (!this.constantVE) {
      this.envelopeCounter++
      if (this.envelopeCounter > (this.VEDivider + 1)) {
        this.envelopeCounter = 0
        if (this.volume !== 0)
          this.setVolume(--this.volume / 15)
        else if (this.volume === 0 && this.lengthCounterHalt) {
          this.volume = this.VEDivider
          this.setVolume(this.volume / 15)
        }
      }
    }
  }

  async lengthCounter() {
    if (!this.lengthCounterHalt) {
      if (this.count > 0)
        this.count--;
      if (this.count === 0) {
        this.setVolume(0)
      }
    }
  }

  connect(destination) {
    this.gain.connect(destination)
  }

  setFrequency(value) {
    this.osc.frequency.setValueAtTime(value, this.audioctx.currentTime)
  }

  setVolume(value) {
    this.gain.gain.setValueAtTime(value, this.audioctx.currentTime)
  }

  setDutyCycle(value) {
    this.waveShaper.curve = this.createDutyCycleCurve(value)
  }

  createDutyCycleCurve(dutyCycle) {
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = i / 255
      curve[i] = x < dutyCycle ? 1 : -1
    }
    return curve;
  }
}

class TriangleWave extends Visualizer {
  registerMap = {
    0x4008: this.writeFirstByte,
    0x4009: async () => { },
    0x400A: this.writeThirdByte,
    0x400B: this.writeFourthByte,
  }

  static LENGTH_TABLE = [
    10, 254, 20, 2, 40, 4, 80, 6,
    160, 8, 60, 10, 14, 12, 26, 14,
    12, 16, 24, 18, 48, 20, 96, 22,
    192, 24, 72, 26, 16, 28, 32, 30
  ]

  constructor({ audioctx, visualize = false }) {
    const analyser = audioctx.createAnalyser()
    super({ analyser, visualize })
    this.analyser = analyser
    this.audioctx = audioctx
    this.osc = audioctx.createOscillator()
    this.gain = audioctx.createGain()

    this.analyser.fftSize = 1024
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    this.osc.type = "triangle"
    this.osc.frequency.value = 440

    this.osc.connect(this.gain)
    this.gain.connect(this.analyser)

    this.setVolume(0)
    this.osc.start()
    this.draw()

    this.count = 0
    this.frequency = 0
    this.timer = { high: 0, low: 0 }

    this.lengthCounterHalt = 0
    this.counterLoad = 0
    this.linearCounter = 0
    this.linearReloadFlag = false
  }

  async write({ address, value }) {
    const func = this.registerMap[address]
    if (func) {
      this.registerMap[address].bind(this)(value)
      this.calcFrequency()
      this.setFrequency(this.frequency)
      if (this.linearCounter > 0 && this.count > 0)
        this.setVolume(1)
      else
        this.setVolume(0)
    }
  }

  writeFirstByte(value) {
    this.lengthCounterHalt = (value & 0x80) >>> 7
    this.counterLoad = (value & 0x7F)
  }

  writeThirdByte(value) {
    this.timer.low = value & 0xFF
  }

  writeFourthByte(value) {
    this.timer.high = value & 0x07
    const lenIndex = (value >>> 3) & 0x1F
    this.count = TriangleWave.LENGTH_TABLE[lenIndex]
    this.linearReloadFlag = true
  }

  connect(destination) {
    this.gain.connect(destination)
  }

  setFrequency(value) {
    this.osc.frequency.setValueAtTime(value, this.audioctx.currentTime)
  }

  setVolume(value) {
    this.gain.gain.setValueAtTime(value, this.audioctx.currentTime)
  }

  async tick({ frame }) {
    if ((frame & 1) === 0) {
      this.lengthCounter()
    }
    this.linearCounterClock()
  }

  calcFrequency() {
    const time = ((this.timer.high << 8) | this.timer.low) & 0x7FF // 11 bits
    this.frequency = 1789773 / (32 * (time + 1))
    if (this.frequency > 20000) this.frequency = 20000
  }

  async lengthCounter() {
    if (!this.lengthCounterHalt) {
      if (this.count > 0) {
        this.count--
      }
      if (this.count === 0) {
        this.setVolume(0)
      }
    }
  }

  linearCounterClock() {
    if (this.linearReloadFlag) {
      this.linearCounter = this.counterLoad
      this.linearReloadFlag = false
    } else {
      if (!this.lengthCounterHalt && this.linearCounter > 0) {
        this.linearCounter--
      }
    }

    if (this.linearCounter > 0 && this.count > 0) {
      this.setVolume(1)
    } else {
      this.setVolume(0)
    }
  }

}
