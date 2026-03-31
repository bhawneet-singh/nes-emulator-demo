const Link = ({ icon, label, href }) => {
  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center", cursor: "pointer" }} className="text-primary">
      <i className={"fa-brands " + icon} style={{ fontSize: "14px" }}></i>
      <a style={{ textDecoration: "none", color: "inherit" }} href={href}>{label}</a>
    </div>
  )
}

const Footer = () => {
  return (
    <div className="footer text-secondary" style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", alignItems: "center", padding: "0px 10px" }}>
      <span>An experimental NES emulator by Bhawneet Singh</span>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Link icon="fa-github" label="Github" href={"https://github.com/bhawneet-singh"}></Link>
        <Link icon="fa-linkedin" label="Linked In" href={"https://www.linkedin.com/in/bhawneetsingh/"}></Link>
      </div>
    </div>
  )
}

export default Footer
