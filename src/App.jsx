import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registration from "./components/auth/Registration";
import EmployeerRegistration from "./components/auth/EmployeerRegistration";
import JobSeekerRegistration from "./components/auth/JobSeekerRegistration";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/register"
          element={<Registration />}
        />

        <Route
          path="/register/employer"
          element={<EmployeerRegistration />}
        />

        <Route
          path="/register/job-seeker"
          element={<JobSeekerRegistration />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;