import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { CryptKeeperClientProvider } from "@src/context/CryptKeeperClientProvider";
import Main from "@src/pages/Main";
import { theme } from "@src/styles";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <BrowserRouter>
    <CryptKeeperClientProvider>
      <Suspense>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Main />
        </ThemeProvider>
      </Suspense>
    </CryptKeeperClientProvider>
  </BrowserRouter>,
);
