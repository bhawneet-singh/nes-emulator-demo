import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Nes, initApu, volume } from "./main.js"

const romsOptions = [
  { label: "Mario", src: "/roms/smb.nes" },
  { label: "Donkey kong", src: "/roms/dkp.nes" },
  { label: "Bomberman", src: "/roms/Bomberman (USA).nes" },
]

const NesView = () => {
  const mainScreen = useRef()
  const canvasRef = useRef()
  const systemControl = useRef()
  const nes = useRef()
  const [rom, setRom] = useState(null)

  useLayoutEffect(() => {
    mainScreen.current.style.height = "100%"
    const scaleFactor = ((mainScreen.current.clientHeight - 60) / 240)

    const height = scaleFactor * 240
    const width = scaleFactor * 256

    mainScreen.current.style.height = height + "px"
    mainScreen.current.style.width = width + "px"
    systemControl.current.style.height = (height + 20) + "px"
    canvasRef.current.style.transform = `scale(${scaleFactor})`
  }, [])

  const play = () => {
    initApu()
    if (nes.current)
      nes.current.worker.terminate()
    nes.current = new Nes()
    nes.current.threadCommunicator.initDisplay(canvasRef.current)
    fetch(rom.src).then(res => res.arrayBuffer().then(buffer => nes.current.worker.postMessage({ run: true, cartridge: buffer })))
  }

  return (
    <div className="main-view">
      <div className="screen">
        <div className="display" ref={mainScreen}>
          <canvas style={{ imageRendering: "pixelated", height: "240px", width: "256px", transformOrigin: "left top" }} ref={canvasRef}></canvas>
        </div>
        <div ref={systemControl} className="system-control" style={{ width: "300px", gap: "20px" }}>
          <ControlCard title="CARTRIDGE" icon="fa-microchip">
            <div style={{ height: "100%", width: "100%", marginTop: "25px", outline: "2px dashed var(--border-dividers)" }}></div>
          </ControlCard>

          <ControlCard title="RUNTIME CONTROLS" icon={"fa-sliders"}>
            <div style={{ display: "flex", width: "100%", marginTop: "15px", gap: "5px" }}>
              <Dropdown onChange={(val) => setRom(val)} style={{ background: "var(--secondary-text)", color: "var(--secondary-background)", flex: 1 }}>{rom ? rom.label : "-- choose a game --"}</Dropdown>
              <Button style={{ background: "#e53935" }} icon={"fa-play"} onClick={play}>Play</Button>
              <Button style={{ background: "#e53935" }} icon={"fa-rotate-left"}>Reset</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "15px" }}>
              <Slider defaultValue={30} onChange={(val) => nes.current.worker.postMessage({ speed: true, emulationSpeed: val * 100 })} title={"Emulation Speed"}></Slider>
              <Slider defaultValue={50} onChange={(val) => volume(val / 100)} title={"Sound"}></Slider>
            </div>
          </ControlCard>

          <ControlCard icon={"fa-music"} title="APU STATUS">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <canvas id="channel-1" style={{ height: "60px" }}></canvas>
              <canvas id="channel-2" style={{ height: "60px" }}></canvas>
              <canvas id="channel-3" style={{ height: "60px" }}></canvas>
            </div>
          </ControlCard>
        </div>
      </div>
      <div className="side-panel">
        <div>
          <div className="text-secondary" style={{ fontSize: "12px" }}>CONTROLS</div>
          <div style={{ height: "2px", background: "var(--border-dividers)", marginTop: "8px" }}></div>
          <div>
            <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "15px" }}>
              <div style={{ display: "grid", width: "120px", gridTemplateColumns: "repeat(3,1fr)", height: "80px" }}>
                <div></div>
                <div>
                  <div style={{ background: "var(--primary-background)", height: "95%", width: "95%", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--primary-text)" }}>
                    <i className="fa-solid fa-circle-up"></i>
                  </div>
                </div>
                <div></div>
                <div>
                  <div style={{ background: "var(--primary-background)", height: "95%", width: "95%", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--primary-text)" }}>
                    <i className="fa-solid fa-circle-left"></i>
                  </div>
                </div>
                <div>
                  <div style={{ background: "var(--primary-background)", height: "95%", width: "95%", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--primary-text)" }}>
                    <i className="fa-solid fa-circle-down"></i>
                  </div>
                </div>
                <div>
                  <div style={{ background: "var(--primary-background)", height: "95%", width: "95%", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--primary-text)" }}>
                    <i className="fa-solid fa-circle-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "10px", display: "flex", color: "var(--primary-text)" }}>
              A button = A, B button = S
            </div>

            <div style={{ marginTop: "10px", display: "flex", color: "var(--primary-text)" }}>
              start = F, select = D
            </div>
          </div>
        </div>


        <div>
          <div className="text-secondary" style={{ fontSize: "12px" }}>SYSTEM INFO</div>
          <div style={{ height: "2px", background: "var(--border-dividers)", marginTop: "8px" }}></div>

          <div className="text-primary" style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <span>CPU</span>
              <span>MOS 6502</span>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <span>Clock</span>
              <span>1.789Mhz</span>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <span>Resolution</span>
              <span>256 * 240</span>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <span>Audio</span>
              <span>Web Audio API</span>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <span>Renderer</span>
              <span>Web Worker</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}


const Button = ({ children, icon, style, onClick }) => {
  return (
    <div className="btn" onClick={onClick} style={{ display: "flex", cursor: "pointer", color: "white", alignItems: "center", gap: "5px", ...style }}>
      {icon && <i className={"fa-solid " + icon}></i>}
      {children}
    </div>
  )
}


const Dropdown = ({ children, style, value, onChange }) => {
  const container = useRef()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const listener = (e) => {
      if (!container.current.contains(e.target)) {
        setVisible(false)
      }
    }
    window.addEventListener("click", listener)
    return () => window.removeEventListener("click", listener)
  }, [])

  return (
    <div ref={container} onClick={() => setVisible(true)} className="btn" style={{ position: "relative", display: "flex", cursor: "pointer", color: "white", alignItems: "center", gap: "5px", ...style }}>
      {children}
      {
        visible && (
          <div style={{ background: "var(--primary-background)", position: "absolute", top: "100%", zIndex: 9999, minWidth: "100%", width: "max-content", left: 0 }}>
            {
              romsOptions.map((val, idx) => {
                return (
                  <div onClick={(e) => { e.stopPropagation(); setVisible(false); onChange(val) }} key={idx} style={{ height: "30px", display: "flex", alignItems: "center", color: "var(--secondary-text)", paddingLeft: "10px" }}>{val.label}</div>
                )
              })
            }

          </div>
        )
      }
    </div>
  )
}
const Slider = ({ defaultValue, title, onChange }) => {
  const containerBox = useRef()
  const containerRef = useRef()

  const [left, setLeft] = useState(defaultValue)

  const mousemove = (e) => {
    let left = null
    if ((e.clientX - 10) < containerBox.current.left)
      left = 0
    else if ((e.clientX + 10) > containerBox.current.right)
      left = containerBox.current.width - 20
    else
      left = e.clientX - containerBox.current.left - 10

    setLeft(left)
    onChange && onChange((left / (containerBox.current.width - 20)) * 100)
  }

  const mouseup = () => {
    window.removeEventListener("mousemove", mousemove)
    window.removeEventListener("mouseup", mouseup)
  }

  const mousedown = (e) => {
    containerBox.current = e.target.parentNode.getBoundingClientRect()
    window.addEventListener("mousemove", mousemove)
    window.addEventListener("mouseup", mouseup)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", mousemove)
      window.removeEventListener("mouseup", mouseup)
    }
  }, [])

  useEffect(() => {
    const box = containerRef.current.getBoundingClientRect()
    setLeft((defaultValue / 100) * (box.width - 20))
  }, [defaultValue])

  return (
    <div >
      {title && <div style={{ fontSize: "12px" }} className="text-secondary">{title}</div>}
      <div ref={containerRef} style={{ position: "relative", height: "40px", width: "100%", display: "flex", alignItems: "center" }}>
        <div style={{ background: "var(--secondary-text)", width: "100%", height: "2px" }}> </div>
        <div onMouseDown={mousedown} style={{ height: "20px", cursor: "pointer", left, position: "absolute", width: "20px", background: "var(--secondary-text)" }}></div>
      </div>
    </div>
  )
}

const ControlCard = ({ children, title, icon }) => {
  return (
    <div style={{ height: "100%", boxSizing: "border-box", outline: "2px solid var(--border-dividers)", display: "flex", flexDirection: "column", padding: "15px", width: "100%", overflow: "visible", background: "var(--secondary-background)" }}>
      <div style={{ fontSize: "12px", fontWeight: "500", display: "flex", alignItems: "center", gap: "2px" }} className="text-secondary">
        <i className={"fa-solid " + icon}></i>
        <span>{title}</span>
      </div>
      {children}
    </div>
  )
}

//test commit

export default NesView
