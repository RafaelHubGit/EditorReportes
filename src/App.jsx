import { BrowserRouter, useRoutes } from "react-router-dom"
import EditorReportesComponent from "./Components/EditorReportesComponent"
import routes from "./router/router"
import LayoutApp from "./layouts/LayoutApp";


const AppRoutes = () => {
  return useRoutes( routes );
}

function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
