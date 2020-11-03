import "./App.css";

import {
  Alert,
  Button,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
} from "reactstrap";
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import {
  category_fetch,
  country_fetch,
  retry_callback,
} from "../libraries/fetcher";
import { useDispatch, useSelector } from "react-redux";

//import AnomalyCountryContainer from "./AnomalyCountry";
//import AnomalyIncidentContainer from "./AnomalyIncident";
//import AnomalySiteContainer from "./AnomalySite";
import AnomalySummary from "./AnomalySummary";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { withRouter } from "react-router";

function list_link_get(label) {
  return (
    <NavItem>
      <NavLink tag={(props) => <Link to="/" {...props}></Link>}>
        {label}
      </NavLink>
    </NavItem>
  );
}

function loading_get_alert(taskList, dispatch) {
  return (
    <React.Fragment>
      {taskList.loading.length > 0 && (
        <Alert color="info" key="loading">
          Page is fetching data, please wait.
        </Alert>
      )}
      {taskList.retrying.map((item, key) => (
        <Alert color="danger" key={`error${key}`}>
          {item.message}
          <Button
            className="float-right"
            onClick={(e) => retry_callback(dispatch, item.callback, item.date)}
            bsstyle="primary"
          >
            Please try again
          </Button>
          <div className="clearfix" />
        </Alert>
      ))}
    </React.Fragment>
  );
}

function panel_get() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={`/summary/${new Date().getFullYear()}`} />
      </Route>
      <Route path="/summary/:year">
        <AnomalySummary />
      </Route>

      {
        //
        //        <Route
        //          path="/summary/:year/:country/:site(.+)"
        //          render={(props) => (
        //            <AnomalySiteContainer
        //              {...props}
        //              delegate_loading_populate={this.handle_loading_populate}
        //              delegate_loading_done={this.handle_loading_done}
        //              delegate_loading_reset={this.handle_loading_reset}
        //            />
        //          )}
        //        />
        //        <Route
        //          path="/summary/:year/:country"
        //          render={(props) => (
        //            <AnomalyCountryContainer
        //              {...props}
        //              delegate_loading_populate={this.handle_loading_populate}
        //              delegate_loading_done={this.handle_loading_done}
        //              delegate_loading_reset={this.handle_loading_reset}
        //            />
        //          )}
        //        />
        //        <Route
        //          path="/incident/:measurement_id"
        //          render={(props) => (
        //            <AnomalyIncidentContainer
        //              {...props}
        //              delegate_loading_populate={this.handle_loading_populate}
        //              delegate_loading_done={this.handle_loading_done}
        //              delegate_loading_reset={this.handle_loading_reset}
        //            />
        //          )}
        //        />
      }
    </Switch>
  );
}

export default withRouter(function (props) {
  const dispatch = useDispatch();
  useEffect(() => {
    category_fetch(dispatch);
  }, [dispatch]);

  useEffect(() => {
    country_fetch(dispatch);
  }, [dispatch]);

  return (
    <Container>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Censorship Dashboard</NavbarBrand>
        <Nav className="ml-auto" navbar>
          {list_link_get("Site anomaly summary")}
        </Nav>
      </Navbar>
      {loading_get_alert(
        useSelector((state) => state.task),
        dispatch
      )}
      {panel_get()}
    </Container>
  );
});