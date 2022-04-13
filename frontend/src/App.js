import { Route, Routes } from "react-router-dom";

import { Navbar, Header, Home, About, MarketItems, MyItems } from "./components";
// import MarketItems from "./components/MarketItems";
// import MyItems from "./components/MyItems";
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
            <Route path="/myItems" element={<MyItems />} exact />
            <Route path="/about" element={<About />} exact />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default App;
