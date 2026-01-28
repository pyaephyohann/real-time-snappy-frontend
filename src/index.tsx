import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import Layout from "./components/Layout";
import Router from "./routes/Router";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <BrowserRouter>
    <Layout>
      <Router />
    </Layout>
  </BrowserRouter>,
);

reportWebVitals();
