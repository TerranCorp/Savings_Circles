import React, { Component } from "react";
import debug from "sabio-debug";
import Geocode from "react-geocode";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import swal from "sweetalert";
import * as locationServices from "../../services/locationServices";
import { Card, CardBody } from "reactstrap";
import "./locationsStyle.css";
import LocationForm from "./LocationForm";

const _logger = debug.extend("Locations"); //Logger

class Locations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationTypeId: 1,
      lineOne: "",
      lineTwo: "",
      city: "",
      zip: "",
      stateId: 0,
      latitude: 65.58572,
      longitude: -153.017578,
      createdBy: 1,
      modifiedBy: 1,
      statusId: 1,
      states: [],
      locationTypes: [],
      validationError: ""
    };

    //Setting up the google api geocode info
    Geocode.setApiKey("SomeAPIKey");
    Geocode.setLanguage("en");
    Geocode.setRegion("na");
  }

  componentDidMount() {
    locationServices
      .getStates()
      .then(this.onStateDataSuccess)
      .catch(this.onStateDataFailure);

    locationServices
      .getLocationTypes()
      .then(this.onGetLocTypeSuccess)
      .catch(this.onGetLocTypeFailure);
  }

  onGetLocTypeSuccess = dataRecieved => {
    this.setState({ locationTypes: dataRecieved.items });
  };

  onGetLocTypeFailure = e => {
    _logger("error recieved is.. ", e.response);
  };

  getLatLong = address => {
    _logger("address is...", address);
    Geocode.fromAddress(address)
      .then(this.onGeoCodeSuccess)
      .catch(this.onGeoCodeFailure);
  };

  onGeoCodeSuccess = response => {
    const { lat, lng } = response.results[0].geometry.location;

    this.setState(
      {
        latitude: lat,
        longitude: lng
      },
      () => this.sendData()
    );
  };

  onGeoCodeFailure = e => {
    _logger("error due to: ", e);
  };

  onStateDataSuccess = dataRecieved => {
    this.setState({ states: dataRecieved.items });
  };

  onStateDataFailure = e => {
    _logger("State-data fetch Failed. ", e);
  };

  handleChange = e => {
    const value = e.target.value;
    const name = e.target.name;

    this.setState(prevState => {
      const updatedFormData = { ...prevState };
      updatedFormData[name] = value;
      return updatedFormData;
    });
  };

  submitData = () => {
    // e.preventDefault();

    let data = { ...this.state };
    let address = data.lineOne;
    this.getLatLong(address);
  };

  sendData = () => {
    let data = { ...this.state };
    let insertData = {
      locationTypeId: data.locationTypeId,
      lineOne: data.lineOne,
      lineTwo: data.lineTwo,
      city: data.city,
      zip: data.zip,
      stateId: data.stateId,
      latitude: data.latitude,
      longitude: data.longitude,
      createdBy: data.createdBy,
      modifiedBy: data.modifiedBy,
      statusId: data.statusId
    };

    _logger("Payload is... ", insertData);

    locationServices
      .addLocation(insertData)
      .then(this.onCreateSuccess)
      .catch(this.onCreateFailure);
  };

  onCreateSuccess = () => {
    swal({
      title: "Location Added.",
      icon: "success"
    });
  };

  onCreateFailure = e => {
    const _logger = debug.extend("Locations-createLocation");
    _logger("Error inserting due to... ", e);
  };

  onSelectedStateChange = e => {
    this.setState({
      stateId: e.target.value
    });
  };

  populateLocationDropDown = () => {
    var locTypeArray = this.state.locationTypes.map(locationType => (
      <option key={locationType.id} value={locationType.id}>
        {locationType.name}
      </option>
    ));

    return locTypeArray;
  };

  fetchFormikData = data => {
    this.setState({
      locationTypeId: data.locationTypeId,
      lineOne: data.lineOne,
      lineTwo: data.lineTwo,
      city: data.city,
      zip: data.zip,
      stateId: data.stateId
    });
    _logger("data passed up is ", data);
    this.submitData();
  };

  populateStatesDropDown = () => {
    var stateArray = this.state.states.map(state => (
      <option key={state.id} value={state.id}>
        {state.code}
      </option>
    ));
    return stateArray;
  };

  LogState = () => {
    _logger(this.state);
  };

  render() {
    return (
      <div className="row">
        <div className="row">
          <LocationForm
            props={this.state}
            stateDropdown={this.populateStatesDropDown}
            locationDropdown={this.populateLocationDropDown}
            sendData={this.fetchFormikData}
          />

          <Card className="googleMap">
            <CardBody style={{ height: "40em", width: "55em" }}>
              <Map
                google={window.google}
                zoom={10}
                style={mapStyles}
                initialCenter={{
                  lat: this.state.latitude,
                  lng: this.state.longitude
                }}
                center={{
                  lat: this.state.latitude,
                  lng: this.state.longitude
                }}
              >
                <Marker
                  position={{
                    lat: this.state.latitude,
                    lng: this.state.longitude
                  }}
                />
              </Map>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStyles = {
  width: "50em",
  height: "35em"
};

//GoogleMaps API wrapper
export default GoogleApiWrapper({
  apiKey: "SomeAPIKey"
})(Locations);
