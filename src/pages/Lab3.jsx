import Header from "../components/Header.jsx";
import {Box, Typography} from "@mui/material";
import Menu from "../components/Menu.jsx";
import Content from "../components/Content.jsx";
import Footer from "../components/Footer.jsx";
import {Route, Routes} from "react-router-dom";
import Lab2 from "./Lab2.jsx";
import Lab1 from "./Lab1.jsx";

export default function Lab3() {
  return(
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" gutterBottom>
        Лабораторная работа №3
      </Typography>
      <Header />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', p: 2, flex: 1 }}>
        <Box sx={{ width: '200px' }}>
          <Menu />
        </Box>

        <Content>
          <Routes>
            <Route path="/lab/1" element={<Lab1 />} />
            <Route path="/lab/2" element={<Lab2 />} />
            {/*<Route path="/lab/3" element={<Lab3 />} />*/}
          </Routes>
        </Content>
      </Box>

      <Footer />
    </Box>
  );
}
