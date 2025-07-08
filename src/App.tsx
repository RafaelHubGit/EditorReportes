import { BrowserRouter, useRoutes } from "react-router-dom"
import EditorReportesComponent from "./Components/EditorReportesComponent"
import routes from "./router/router"
// import LayoutApp from "./layouts/LayoutApp";

import '../src/styles/index.scss';

export const App = () => {
  return useRoutes( routes );
}

// function App() {

//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   )
// }
