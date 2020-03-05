import React from "react";
import { Formik, Form, Field } from "formik";
import { Card, CardBody, Button } from "reactstrap";
import locationsValidation from "./LocationsValidation";
import PropTypes from "prop-types";
import logger from "sabio-debug";

const _logger = logger.extend("LocationForm");

export default function LocationForm(props) {
  var initValues = {
    locationTypeId: 1,
    lineOne: props.lineOne ? props.lineOne : "",
    lineTwo: "",
    city: props.city ? props.city : "",
    zip: props.zip ? props.zip : "",
    stateId: props.stateId ? props.stateId : ""
  };

  const handleSubmit = values => {
    _logger("formik values", values);
    methodBag.sendData(values);
  };

  const methodBag = {
    locationDropdown: props.locationDropdown,
    stateDropdown: props.stateDropdown,
    sendData: props.sendData
  };

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initValues}
        validationSchema={locationsValidation}
        onSubmit={handleSubmit}
      >
        {formik => (
          <Card className="locationInfo">
            <CardBody>
              <Form
                className="theme-form mega-form"
                onSubmit={formik.handleSubmit}
              >
                <h6>Location Information</h6>
                <div className="form-group">
                  <label className="form-label">Location Type: </label>
                  <Field component="select" name="locationTypeId">
                    {methodBag.locationDropdown()}
                  </Field>
                </div>
                <div className="form-group">
                  <label className="col-form-label">Address</label>
                  <Field
                    type="text"
                    placeholder="Enter your street address here."
                    className="form-control"
                    name="lineOne"
                    value={formik.values.lineOne}
                  />
                  {formik.errors.lineOne && formik.touched.lineOne && (
                    <span className="input-feedback">
                      {formik.errors.lineOne}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label className="col-form-label">Apt/P.O. Box</label>
                  <Field
                    placeholder="Enter your Apt/P.O. Box number here."
                    type="text"
                    className="form-control"
                    name="lineTwo"
                    value={formik.values.lineTwo}
                  ></Field>
                </div>
                <div className="form-group">
                  <label className="col-form-label">City</label>
                  <Field
                    placeholder="Enter city"
                    type="text"
                    className="form-control"
                    name="city"
                    value={formik.values.city}
                  />{" "}
                  {formik.errors.city && formik.touched.city && (
                    <span className="input-feedback">{formik.errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <Field component="select" name="stateId">
                      {methodBag.stateDropdown()}
                    </Field>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Zip Code</label>
                    <Field
                      placeholder="Enter your zip code here."
                      type="text"
                      className="form-control"
                      name="zip"
                      value={formik.values.zip}
                    ></Field>
                    {formik.errors.zip && formik.touched.zip && (
                      <span className="input-feedback">
                        {formik.errors.zip}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!formik.isValid}
                  onSubmit={formik.resetForm}
                >
                  Submit
                </Button>
              </Form>
            </CardBody>
          </Card>
        )}
      </Formik>
    </div>
  );
}

LocationForm.propTypes = {
  locationTypeId: PropTypes.number,
  lineOne: PropTypes.string,
  lineTwo: PropTypes.string,
  city: PropTypes.string,
  zip: PropTypes.string,
  stateId: PropTypes.number,
  Latitude: PropTypes.number,
  Longitude: PropTypes.number,
  CreatedBy: PropTypes.number,
  ModifiedBy: PropTypes.number,
  StatusId: PropTypes.number,
  stateDropdown: PropTypes.func,
  locationDropdown: PropTypes.func,
  sendData: PropTypes.func
};
