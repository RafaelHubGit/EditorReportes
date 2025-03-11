import { BrowserRouter, useRoutes } from "react-router-dom"
import EditorReportesComponent from "./Components/EditorReportesComponent"
import routes from "./router/router"


const AppRoutes = () => {
  return useRoutes( routes );
}

function App() {

  return (
    <BrowserRouter>
      {/* <EditorReportesComponent /> */}
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
