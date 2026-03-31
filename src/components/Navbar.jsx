const Navbar = () => {
  return (
    <div className="navbar">
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", marginLeft: "10px" }}>
        <span className="text-primary" >NES Emulator</span>
        <span className="text-secondary" style={{ fontSize: "12px" }}>Nintendo Entertainment System - Javascript</span>
      </div>
    </div>
  )
}

export default Navbar
