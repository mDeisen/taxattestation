import Navbar from "./Navbar"
import AttestStatement from "./pages/AttestStatement"
import RevokeAttestation from "./pages/RevokeAttestation"
import VerifyStatement from "./pages/VerifyStatement"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<AttestStatement />} />
          <Route path="/verifystatement" element={<VerifyStatement />} />
          <Route path="/revokeattestation" element={<RevokeAttestation />} />
        </Routes>
      </div>
    </>
  )
}

export default App