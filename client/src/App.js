import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import Header from "./components/layout/Header";
import Dashboard from "./components/dashboard/Dashboard";

import UserSignIn from "./components/user/UserSignIn";
import UserSignUp from "./components/user/UserSignUp";
import UserSignOut from "./components/user/UserSignOut";
import UpdateUser from "./components/user/UpdateUser";

import NotFound from "./components/errors/NotFound";
import Forbidden from "./components/errors/Forbidden";
import UnhandledError from "./components/errors/UnhandledError";

import PrivateRoute from "./PrivateRoute";

import ResourceList from "./components/resource/ResourceList";
import ResourceDetail from "./components/resource/ResourceDetail";
import ResourceForm from "./components/resource/ResourceForm";
import ResourceReport from "./components/resource/ResourceReport";

import { resourceConfig } from "./resources/config";

function App() {

  const location = useLocation();

  const resources = Object.keys(resourceConfig);

  const isReportPage = location.pathname.endsWith("/report");

  return (
    <div id="root">

      {!isReportPage && <Header />}

      <main>
        <Routes>

          <Route path="/" element={<Navigate replace to="/dashboard" />} />

          <Route path="/signin" element={<UserSignIn />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/signout" element={<UserSignOut />} />

          <Route element={<PrivateRoute />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/user/:id/update" element={<UpdateUser />} />

            {resources.map(resource => (

              <React.Fragment key={resource}>

                <Route
                  path={`/${resource}`}
                  element={<ResourceList resource={resource} />}
                />

                <Route
                  path={`/${resource}/create`}
                  element={<ResourceForm resource={resource} mode="create" />}
                />

                <Route
                  path={`/${resource}/:id`}
                  element={<ResourceDetail resource={resource} />}
                />

                <Route
                  path={`/${resource}/:id/update`}
                  element={<ResourceForm resource={resource} mode="update" />}
                />

                <Route
                  path={`/${resource}/report`}
                  element={<ResourceReport resource={resource} />}
                />

              </React.Fragment>

            ))}

          </Route>

          <Route path="/notfound" element={<NotFound />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/error" element={<UnhandledError />} />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

    </div>
  );
}

export default App;