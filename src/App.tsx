import { useRoutes } from "react-router-dom"
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
