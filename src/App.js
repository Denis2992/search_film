import React from "react";
import { Box } from "@mui/system";
import { HashRouter, Route, Routes } from "react-router-dom";
import StartWindow from "./components/startWindow";
import WishList from "./components/wishList";

function App() {
  return (
    <Box>
      <HashRouter>
        <Routes>
          <Route exact path='/' element={<StartWindow />} />
          <Route path='/wishes_list' element={<WishList />} />
        </Routes>
      </HashRouter>
    </Box>
  );
}

export default App;
