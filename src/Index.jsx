import Footer from "./Components/Footer"
import Header from "./Components/Header"
import { Outlet } from "react-router-dom"
import "./Styles/index.css"
function Index() {

  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default Index
