import { Route, Routes } from "react-router-dom";

import { Navbar, Header, Home, About } from "./components";
import MarketItems from "./components/MarketItems";
const App = () => {
  return (
    <>
      <div className="min-h-screen">
        <Header />
        {/* <div className="gradient-bg-welcome"> */}
        <div>
          <Routes>
            <Route path="/home" element={<Home />} exact />
            <Route path="/marketItems" element={<MarketItems />} exact />
            <Route path="/about" element={<About />} exact />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default App;
