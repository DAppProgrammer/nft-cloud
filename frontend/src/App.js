import { Route, Routes } from "react-router-dom";

import { Navbar, Home, About } from "./components";
const App = () => {
  return (
    <>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Routes>
            <Route path="/home" element={<Home />} exact />
            <Route path="/about" element={<About />} exact />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default App;
