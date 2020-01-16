import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  FormHelperText,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  RadioGroup,
  Select,
  Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import { sp, Web } from "@pnp/sp";
import * as React from "react";
import * as _ from "lodash";
import { CustomRadio, state_DD, CustomButton } from "../common/common";
import styles from "./shareholders.module.scss";

export class Elections extends React.Component<any, any> {
  public electionRef = React.createRef<HTMLFormElement>();
  public statesDD = state_DD;
  public constructor(props: any, state: any) {
    super(props);
    this.getAccountInfromation = this.getAccountInfromation.bind(this);
    this.state = {
      properties: this.props.properties,
      electionInformation: [],
      state_DD: state_DD,
      state_slected: "NA",
      state_slected_disabled:false,
      state_slected_Error: false,
      years_DD: [],
      ele_taxYear: "-- Please Select Tax Year --",
      ele_taxYear_Error: false,
      de_Val: "none",
      de_Val_Error: false,
      md_Val: "none",
      md_Val_Error: false,
      pa_Val: "none",
      pa_Val_Error: false,
      va_Val: "none",
      va_Val_Error: false,
      nj_Val: "none",
      nj_Val_Error: false,
      de_disabled: false,
      md_disabled: false,
      nj_disabled: false,
      pa_disabled: false,
      va_disabled: false,
      submitted: false,
      hasError: false,
      electionSnackbar_open: false,
      submitElection_Btn:false,
      makeAvilable_Year:null
    };
  }

  public validateElections = e => {
    let error = {
      ele_taxYear_Error: this.state.ele_taxYear_Error,
      state_slected_Error: this.state.state_slected_Error,
      de_Val_Error: this.state.de_Val_Error,
      md_Val_Error: this.state.md_Val_Error,
      pa_Val_Error: this.state.pa_Val_Error,
      va_Val_Error: this.state.va_Val_Error,
      nj_Val_Error: this.state.nj_Val_Error
    };
    if (this.state.ele_taxYear === "-- Please Select Tax Year --") {
      this.setState({ ele_taxYear_Error: true });
      error.ele_taxYear_Error = true;
    } else {
      error.ele_taxYear_Error = false;
    }
    if (this.state.state_slected === "NA") {
      this.setState({ state_slected_Error: true });
      error.state_slected_Error = true;
    } else {
      error.state_slected_Error = false;
    }
    if (this.state.de_Val === "none") {
      this.setState({ de_Val_Error: true });
      error.de_Val_Error = true;
    } else {
      error.de_Val_Error = false;
    }
    if (this.state.md_Val === "none") {
      this.setState({ md_Val_Error: true });
      error.md_Val_Error = true;
    } else {
      error.md_Val_Error = false;
    }
    if (this.state.pa_Val === "none") {
      this.setState({ pa_Val_Error: true });
      error.pa_Val_Error = true;
    } else {
      error.pa_Val_Error = false;
    }
    if (this.state.va_Val === "none") {
      this.setState({ va_Val_Error: true });
      error.va_Val_Error = true;
    } else {
      error.va_Val_Error = false;
    }
    if (this.state.nj_Val === "none") {
      this.setState({ nj_Val_Error: true });
      error.nj_Val_Error = true;
    } else {
      error.nj_Val_Error = false;
    }
    const identifiers = Object.keys(error);
    const activeError = identifiers.filter(id => {
      return error[id];
    });
    if (activeError.length === 0) {
      this.addElectiondataTolist();
    }
  }

  public onTaxYearChange = (e) =>{
    let yr = e.target.value;
    let taxYear = this.state.years_DD;
    let isYeatActive = [];
    isYeatActive = _.filter(taxYear, (val) => {
      return val.text === yr;
    });
    if (yr === "-- Please Select Tax Year --") {
      this.setState({
        ele_taxYear: yr,
        ele_taxYear_Error: true
      });
    } else {
      if (isYeatActive[0].makeAvilabled === "Yes") {
        let electionInformation = [];
        electionInformation = _.filter(this.state.electionInformation, (val) => {
          return val.TaxYear === yr;
        });
        if (electionInformation.length === 1) {
          this.setState({
            ele_taxYear: yr,
            ele_taxYear_Error: false,
            de_disabled: false,
            md_disabled: false,
            nj_disabled: false,
            pa_disabled: false,
            va_disabled: false,
            submitElection_Btn:false,
            state_slected_disabled:false,
            va_Val: electionInformation[0].Virginia,
            de_Val: electionInformation[0].Delaware,
            md_Val: electionInformation[0].Maryland,
            pa_Val: electionInformation[0].Pennsylvania,
            nj_Val: electionInformation[0].NewJersey,
            state_slected:electionInformation[0].StateforStateTaxes
          });

        } else {
          this.setState({
            ele_taxYear: yr,
            ele_taxYear_Error: false,
            de_disabled: false,
            md_disabled: false,
            nj_disabled: false,
            pa_disabled: false,
            va_disabled: false,
            submitElection_Btn:false,
            state_slected_disabled:false,
            va_Val: "none",
            de_Val: "none",
            md_Val: "none",
            pa_Val: "none",
            nj_Val: "none",
            state_slected:"NA",
          });
        }
      } else {
        let electionInformation = [];
        electionInformation = _.filter(this.state.electionInformation, (val) => {
          return val.TaxYear === yr;
        });
        if (electionInformation.length > 0) {
          this.setState({
            ele_taxYear: yr,
            ele_taxYear_Error: false,
            de_disabled: true,
            md_disabled: true,
            nj_disabled: true,
            pa_disabled: true,
            va_disabled: true,
            submitElection_Btn:true,
            state_slected_disabled:true,
            va_Val: electionInformation[0].Virginia,
            de_Val: electionInformation[0].Delaware,
            md_Val: electionInformation[0].Maryland,
            pa_Val: electionInformation[0].Pennsylvania,
            nj_Val: electionInformation[0].NewJersey,
            state_slected:electionInformation[0].StateforStateTaxes
          });
        } else {
          this.setState({
            ele_taxYear: yr,
            ele_taxYear_Error: false,
            de_disabled: true,
            md_disabled: true,
            nj_disabled: true,
            pa_disabled: true,
            va_disabled: true,
            submitElection_Btn:true,
            state_slected_disabled:true,
            va_Val: "none",
            de_Val: "none",
            md_Val: "none",
            pa_Val: "none",
            nj_Val: "none",
            state_slected:"NA"
          });
        }

      }
    }
  }

  public onStateChange(e) {
    let selectedState = e.target.value;
    if (selectedState === "NA") {
      this.setState({
        state_slected: selectedState,
        state_slected_Error: true
      });
    } else {
      this.setState({
        state_slected: selectedState,
        state_slected_Error: false
      });
      switch (selectedState) {
        case "DE":
          this.setState({
            state_slected: selectedState,
            de_Val: "Out",
            md_Val: "none",
            pa_Val: "none",
            va_Val: "none",
            nj_Val: "none",
            de_disabled: true,
            md_disabled: false,
            nj_disabled: false,
            pa_disabled: false,
            va_disabled: false,
            de_Val_Error: false
          });
          break;
        case "MD":
          this.setState({
            state_slected: selectedState,
            md_Val: "Out",
            de_Val: "none",
            pa_Val: "none",
            va_Val: "none",
            nj_Val: "none",
            md_disabled: true,
            de_disabled: false,
            nj_disabled: false,
            pa_disabled: false,
            va_disabled: false,
            md_Val_Error: false
          });
          break;
        case "NJ":
          this.setState({
            state_slected: selectedState,
            nj_Val: "Out",
            de_Val: "none",
            md_Val: "none",
            pa_Val: "none",
            va_Val: "none",
            md_disabled: false,
            de_disabled: false,
            nj_disabled: true,
            pa_disabled: false,
            va_disabled: false,
            nj_Val_Error: false
          });
          break;
        case "PA":
          this.setState({
            state_slected: selectedState,
            pa_Val: "Out",
            de_Val: "none",
            md_Val: "none",
            va_Val: "none",
            nj_Val: "none",
            md_disabled: false,
            de_disabled: false,
            nj_disabled: false,
            pa_disabled: true,
            va_disabled: false,
            pa_Val_Error: false
          });
          break;
        case "VA":
          this.setState({
            state_slected: selectedState,
            va_Val: "Out",
            de_Val: "none",
            md_Val: "none",
            pa_Val: "none",
            nj_Val: "none",
            md_disabled: false,
            de_disabled: false,
            nj_disabled: false,
            pa_disabled: false,
            va_disabled: true,
            va_Val_Error: false
          });
          break;
        default:
          this.setState({
            md_disabled: false,
            de_disabled: false,
            nj_disabled: false,
            pa_disabled: false,
            va_disabled: false,
            va_Val: "none",
            de_Val: "none",
            md_Val: "none",
            pa_Val: "none",
            nj_Val: "none",
          });
          console.log("default");
          break;
      }
    }
  }

  public componentDidMount() {
    this.getTaxyears();
  }

  public getTaxyears = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Tax Year")
      .items.select("Title", "ID", "MakeAvilable")
      .get()
      .then(d => {
        if (d.length > 0) {
          let obj = [
            {
              key: "NA",
              text: "-- Please Select Tax Year --",
              makeAvilabled: ""
            }
          ];
          let makeAvilableYear = '';
          for (let index = 0; index < d.length; index++) {
            if (d[index].MakeAvilable === "Yes") {
              makeAvilableYear = d[index].Title;
              obj.push({
                key: d[index].Title,
                text: d[index].Title,
                makeAvilabled: d[index].MakeAvilable
              });
            } else {
              obj.push({
                key: d[index].Title,
                text: d[index].Title,
                makeAvilabled: d[index].MakeAvilable
              });
            }

          }
          this.setState(
            {
              years_DD: obj,
              makeAvilable_Year:makeAvilableYear
            },
            () => {
              if (this.state.properties.shareholderID !== undefined) {
                this.getAccountInfromation(this.state.properties.shareholderID);
              }
            }
          );
        }
      });
  }

  public getAccountInfromation(id): any {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholding Elections")
        .items.select(
          "ID",
          "Title",
          "TaxYear",
          "StateforStateTaxes",
          "Delaware",
          "Maryland",
          "NewJersey",
          "Pennsylvania",
          "Virginia",
          "Modified",
          "Created"
        )
        .orderBy("Title", true)
        .filter("Title eq '" + id + "'")
        .get()
        .then(d => {
          if (d.length > 0) {
            let res = [];
            let isYeatActive = [];
            res = _.filter(d, val => {
              return val.TaxYear === this.state.makeAvilable_Year;
            });
            isYeatActive = _.filter(this.state.years_DD, val => {
              return val.text === this.state.makeAvilable_Year;
            });
            if (res.length === 1) {
              this.setState(
                {
                  electionInformation: d,
                  ele_taxYear: res[0].TaxYear !== null ? res[0].TaxYear : "NA",
                  state_slected:
                    res[0].StateforStateTaxes !== null
                      ? res[0].StateforStateTaxes
                      : "NA",
                  de_Val: res[0].Delaware !== null ? res[0].Delaware : "none",
                  md_Val: res[0].Maryland !== null ? res[0].Maryland : "none",
                  nj_Val: res[0].NewJersey !== null ? res[0].NewJersey : "none",
                  pa_Val:
                    res[0].Pennsylvania !== null ? res[0].Pennsylvania : "none",
                  va_Val: res[0].Virginia !== null ? res[0].Virginia : "none",
                  de_disabled: false,
                  md_disabled: false,
                  nj_disabled: false,
                  pa_disabled: false,
                  va_disabled: false,
                  submitElection_Btn: false
                },
                () => {
                  this.onLoadSetStateOptions();
                }
              );
            } else {
              this.setState(
                {
                  electionInformation: d,
                  state_slected: "NA",
                  ele_taxYear: "-- Please Select Tax Year --",
                  de_Val: "none",
                  md_Val: "none",
                  nj_Val: "none",
                  pa_Val: "none",
                  va_Val: "none",
                  de_disabled: false,
                  md_disabled: false,
                  nj_disabled: false,
                  pa_disabled: false,
                  va_disabled: false,
                  submitElection_Btn: false
                },
                () => {
                  this.onLoadSetStateOptions();
                }
              );
            }
          } else {
            this.setState({
              electionInformation: [],
              state_slected: "NA",
              ele_taxYear: "-- Please Select Tax Year --"
            });
          }
        });
    }
  }

  public onLoadSetStateOptions = () => {
    let selectedState = this.state.state_slected;
    switch (selectedState) {
      case "DE":
        this.setState({
          de_Val: "Out",
          de_disabled: true
        });
        break;
      case "MD":
        this.setState({
          md_Val: "Out",
          md_disabled: true
        });
        break;
      case "NJ":
        this.setState({
          nj_Val: "Out",
          nj_disabled: true
        });
        break;
      case "PA":
        this.setState({
          pa_Val: "Out",
          pa_disabled: true
        });
        break;
      case "VA":
        this.setState({
          va_Val: "Out",
          va_disabled: true
        });
        break;
      default:
        this.setState({
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: false,
          submitElection_Btn:false,
        });
    }
  }

  public snackbar_handleClose = () => {
    this.setState({ ...this.state, snackbar_open: false });
  }

  public addElectiondataTolist = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    this.setState({ submitted: true }, () => {
      if (this.state.electionInformation.length > 0) {
        newWeb.lists
          .getByTitle("Shareholding Elections")
          .items.getById(this.state.electionInformation[0].ID)
          .update({
            Title: this.state.properties.shareholderID.toString(),
            TaxYear: this.state.ele_taxYear.toString(),
            StateforStateTaxes: this.state.state_slected.toString(),
            Delaware: this.state.de_Val.toString(),
            Maryland: this.state.md_Val.toString(),
            NewJersey: this.state.nj_Val.toString(),
            Pennsylvania: this.state.pa_Val.toString(),
            Virginia: this.state.va_Val.toString(),
            Florida: "N/A"
          })
          .then(i => {
            this.setState({
              electionSnackbar_open: true,
              submitted: false
            });
          })
          .catch(e => {
            console.log(e.toString());
          });
      } else {
        newWeb.lists
          .getByTitle("Shareholding Elections")
          .items.add({
            Title: this.state.properties.shareholderID.toString(),
            TaxYear: this.state.ele_taxYear.toString(),
            StateforStateTaxes: this.state.state_slected.toString(),
            Delaware: this.state.de_Val.toString(),
            Maryland: this.state.md_Val.toString(),
            NewJersey: this.state.nj_Val.toString(),
            Pennsylvania: this.state.pa_Val.toString(),
            Virginia: this.state.va_Val.toString(),
            Florida: "N/A"
          })
          .then(i => {
            this.setState({
              electionSnackbar_open: true,
              submitted: false
            });
          })
          .catch(e => {
            console.log(e.toString());
          });
      }
    });
    setTimeout(
      () => this.setState({ electionSnackbar_open: false, submitted: false }),
      5000
    );
  }

  public info_html = () => {
    let check = (
      <React.Fragment>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-sm-5">
            <FormControl
              error={this.state.ele_taxYear_Error}
              fullWidth
              style={{ margin: "10px", color: "black" }}
            >
              <InputLabel
                error={this.state.ele_taxYear_Error}

                style={{
                  color:
                    this.state.ele_taxYear_Error !== true ? "#976340" : "red"
                }}
              >
                Tax Year*
              </InputLabel>
              <Select
                name="ele_taxYear"
                value={this.state.ele_taxYear}
                defaultValue={{
                  key: "NA",
                  text: "-- Please Select Tax Year --"
                }}
                onChange={e => {
                  this.onTaxYearChange(e)
                }}
                error={this.state.ele_taxYear_Error}
                fullWidth
              >
                {this.state.years_DD.map(item => {
                  return (
                    <MenuItem key={item.length} value={item.text}>
                      {item.text}
                    </MenuItem>
                  );
                })}
              </Select>
              {this.state.ele_taxYear_Error !== false ? (
                <FormHelperText>Please Select Tax Year</FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </div>
          <div className="col-sm-5">
            <FormControl
              fullWidth
              error={this.state.state_slected_Error}
              style={{ margin: "10px" }}
            >
              <InputLabel
              disabled={this.state.state_slected_disabled}
                error={this.state.state_slected_Error}
                style={{
                  color:
                    this.state.state_slected_Error !== true ? "#976340" : "red"
                }}
              >
                Resident State for State Taxes*
              </InputLabel>
              <Select
              disabled={this.state.state_slected_disabled}
                labelId="state-for-state-tax"
                input={<Input />}
                name="dma_State"
                onChange={this.onStateChange.bind(this)}
                value={this.state.state_slected}
              >
                {this.statesDD.map((item, i) => {
                  return (
                    <MenuItem key={i} value={item.key}>
                      {item.text}
                    </MenuItem>
                  );
                })}
              </Select>
              {this.state.state_slected_Error !== false ? (
                <FormHelperText>Please Select State</FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                error={this.state.de_Val_Error}
                fullWidth
                component="fieldset"
              >
                <FormLabel
                  error={this.state.de_Val_Error}
                  component="legend"
                  style={{
                    color: this.state.de_Val_Error !== true ? "#976340" : "red"
                  }}
                  //style={{ color: "#976340" }}
                >
                  Delaware*
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.de_Val}
                  onChange={e => {
                    if (e.target.value === "" || e.target.value === "none") {
                      this.setState({
                        de_Val: e.target.value,
                        de_Val_Error: true
                      });
                    } else {
                      this.setState({
                        de_Val: e.target.value,
                        de_Val_Error: false
                      });
                    }
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<CustomRadio />}
                    label="In"
                    disabled={this.state.de_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<CustomRadio color="primary" />}
                    label="Out"
                    disabled={this.state.de_disabled}
                    labelPlacement="end"
                  />
                </RadioGroup>
                {this.state.de_Val_Error !== false ? (
                  <FormHelperText className={styles.formHelperTextStyles}>
                    Delaware Cannot be blank
                  </FormHelperText>
                ) : (
                  false
                )}
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" style={{ color: "#976340" }}>
                Florida*
              </FormLabel>
              <InputLabel disabled>Not applicable</InputLabel>
            </FormControl>
          </div>
          <div className="col-md-4">
            <FormControl
              component="fieldset"
              error={this.state.md_Val_Error}
              fullWidth
            >
              <FormLabel
                component="legend"
                style={{
                  color: this.state.de_Val_Error !== true ? "#976340" : "red"
                }}
                //style={{ color: "#976340" }}
              >
                Maryland*
              </FormLabel>
              <RadioGroup
                row
                aria-label="position"
                defaultValue="none"
                name="position"
                value={this.state.md_Val}
                onChange={e => {
                  if (e.target.value === "" || e.target.value === "none") {
                    this.setState({
                      md_Val: e.target.value,
                      md_Val_Error: true
                    });
                  } else {
                    this.setState({
                      md_Val: e.target.value,
                      md_Val_Error: false
                    });
                  }
                }}
              >
                <FormControlLabel
                  value="In"
                  control={<CustomRadio />}
                  label="In"
                  disabled={this.state.md_disabled}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="Out"
                  control={<CustomRadio />}
                  label="Out"
                  disabled={this.state.md_disabled}
                  labelPlacement="end"
                />
              </RadioGroup>
              {this.state.md_Val_Error !== false ? (
                <FormHelperText className={styles.formHelperTextStyles}>
                  Maryland Cannot be blank
                </FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                error={this.state.nj_Val_Error}
                component="fieldset"
                fullWidth
              >
                <FormLabel
                  component="legend"
                  //style={{ color: "#976340" }}
                  style={{
                    color: this.state.nj_Val_Error !== true ? "#976340" : "red"
                  }}
                >
                  New Jersey *
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.nj_Val}
                  onChange={e => {
                    if (e.target.value === "" || e.target.value === "none") {
                      this.setState({
                        nj_Val: e.target.value,
                        nj_Val_Error: true
                      });
                    } else {
                      this.setState({
                        nj_Val: e.target.value,
                        nj_Val_Error: false
                      });
                    }
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<CustomRadio />}
                    label="In"
                    disabled={this.state.nj_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<CustomRadio />}
                    label="Out"
                    disabled={this.state.nj_disabled}
                    labelPlacement="end"
                  />
                </RadioGroup>
                {this.state.nj_Val_Error !== false ? (
                  <FormHelperText className={styles.formHelperTextStyles}>
                    New Jersey Cannot be blank
                  </FormHelperText>
                ) : (
                  false
                )}
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                component="fieldset"
                fullWidth
                error={this.state.pa_Val_Error}
              >
                <FormLabel
                  component="legend"
                  style={{
                    color: this.state.pa_Val_Error !== true ? "#976340" : "red"
                  }}
                >
                  Pennsylvania*
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.pa_Val}
                  onChange={e => {
                    if (e.target.value === "" || e.target.value === "none") {
                      this.setState({
                        pa_Val: e.target.value,
                        pa_Val_Error: true
                      });
                    } else {
                      this.setState({
                        pa_Val: e.target.value,
                        pa_Val_Error: false
                      });
                    }
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<CustomRadio />}
                    label="In"
                    disabled={this.state.pa_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<CustomRadio />}
                    label="Out"
                    disabled={this.state.pa_disabled}
                    labelPlacement="end"
                  />
                </RadioGroup>
                {this.state.pa_Val_Error !== false ? (
                  <FormHelperText className={styles.formHelperTextStyles}>
                    Pennsylvania Cannot be blank
                  </FormHelperText>
                ) : (
                  false
                )}
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <FormControl
              component="fieldset"
              fullWidth
              error={this.state.va_Val_Error}
            >
              <FormLabel
                component="legend"
                style={{
                  color: this.state.va_Val_Error !== true ? "#976340" : "red"
                }}
              >
                Virginia*
              </FormLabel>
              <RadioGroup
                row
                aria-label="position"
                defaultValue="none"
                name="position"
                value={this.state.va_Val}
                onChange={e => {
                  if (e.target.value === "" || e.target.value === "none") {
                    this.setState({
                      va_Val: e.target.value,
                      va_Val_Error: true
                    });
                  } else {
                    this.setState({
                      va_Val: e.target.value,
                      va_Val_Error: false
                    });
                  }
                }}
              >
                <FormControlLabel
                  value="In"
                  control={<CustomRadio />}
                  label="In"
                  disabled={this.state.va_disabled}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="Out"
                  control={<CustomRadio />}
                  label="Out"
                  disabled={this.state.va_disabled}
                  labelPlacement="end"
                />
              </RadioGroup>
              {this.state.va_Val_Error !== false ? (
                <FormHelperText className={styles.formHelperTextStyles}>
                  Virginia Cannot be blank
                </FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <FormControl component="fieldset" fullWidth>
              <FormLabel  component="legend">
                Federal*
              </FormLabel>
              <InputLabel disabled>
                Not applicable
              </InputLabel>
            </FormControl>
          </div>
        </div>
      </React.Fragment>
    );
    return check;
  }

  public render(): React.ReactElement<any> {
    const info_html = this.info_html();
    return (
      <div className={styles.shareholders}>
        <div className={styles.elections}>
          <form ref={e => this.electionRef} onSubmit={e => e.preventDefault()}>
            <Paper className={styles.paper}>
              <Typography variant="h5" className={styles.electionSubHeadings}>
                Shareholding Resident State for Taxes and Composite Elections
              </Typography>
              <div className="alert" role="alert">
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  The below items represent your current tax year’s recorded
                  Resident State and State Composite Tax Return Elections
                  (Composite Elections) on file with Wawa, Inc. If the elections
                  below are blank or don’t agree with your records or
                  intentions, please update them by completing and submitting
                  below. If you have any questions, please contact the
                  Shareholder Services Office at{" "}
                  <a
                    className="text-danger"
                    href="mailto:ShareholderServices@Wawa.com"
                  >
                    ShareholderServices@Wawa.com
                  </a>
                  or 484-840-1813.
                </p>
              </div>
              <div
                className={`${styles.alignAlert} alert alert-secondary`}
                role="alert"
              >
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  <span className="text-danger border-bottom border-danger">
                    Trust shareholders please note:
                  </span>{" "}
                  Trusts are generally limited in, or prohibited from,
                  participating in composite tax returns. However, Wawa has
                  received permission for certain trusts to participate in some
                  states' composite returns and there are more opportunities to
                  participate in 2019 than in previous years. A full discussion
                  of trust eligibility for composite returns is contained within
                  the instructions accompanying the downloadable form and can be
                  accessed by following the link below. Also, an Ernst and Young
                  opinion letter referenced in the instructions, which analyzes
                  the opportunity for trusts to participate in the Maryland
                  composite return, is available and accessible through the
                  second link below.
                </p>
              </div>
              <div className={`${styles.alignAlert} alert`} role="alert">
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  We strongly encourage you to consult with your tax advisors to
                  determine the best elections for your shareholdings. You can
                  view (but not change) your prior year elections by changing
                  the "Tax Year" below using the drop-down list. The state
                  buttons will then reflect the elections for the year that is
                  showing in the "Tax Year" box.
                  <p className={`${styles.electionsGeneralText} text-justify`}>
                    &nbsp;
                  </p>
                </p>
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  The full instruction and explanation document for composite
                  elections can be found in the document library or by clicking
                  the following link: Download Full Elections Instructions
                  <p className={`${styles.electionsGeneralText} text-justify`}>
                    &nbsp;
                  </p>
                </p>
                <p className={`${styles.electionsGeneralText} text-justify`}>
                  The Ernst and Young opinion letter addressing trusts'
                  participation in the Maryland composite return can also be
                  found in the document library or by clicking the following
                  link: Download Ernst & Young Opinion Letter
                  <p className={`${styles.electionsGeneralText} text-justify`}>
                    &nbsp;
                  </p>
                </p>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                <div className="card">
                  <div className={`card-body`}>
                    <div className={`${styles.cardHead_General} card-header`}>
                      <h6>
                        Update your Current Resident State and Composite
                        Elections below and click "Submit Elections"
                      </h6>
                    </div>
                    <div className="row-fluid">
                      {info_html}
                      <div className="row">&nbsp;</div>
                      <div className="row">
                        <div className="col-lg-8 class-md-8 class-sm-12 class-xs-12">
                          <div className="alert alert-danger">
                            <p
                              className={`${styles.electionsGeneralText} text-justify`}
                            >
                              <strong
                                className={`${styles.electionsGeneralText}`}
                              >
                                * REQUIRED FIELDS – NOTE:{" "}
                              </strong>
                              If neither IN nor OUT are indicated above for any
                              state, the Company does NOT have an election on
                              record for this year and must treat those states
                              as if they were OUT elections by rule.
                              ............................................. ###
                              CONFIRMATION OF YOUR ELECTIONS WILL APPEAR AT THE
                              TOP OF THIS SCREEN ###
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4 class-md-4 class-sm-12 class-xs-12">
                          <CustomButton

                            disabled={this.state.submitElection_Btn}
                            type="button"
                            className={`fixed-bottom`}
                            // ${styles.electionSubmitBtn}
                            onClick={this.validateElections}
                          >
                            <CheckCircleIcon fontSize="default" />{" "}
                            {(this.state.submitted && "Election Submitted!") ||
                              (!this.state.submitted && "Submit Election")}
                          </CustomButton>
                          <div
                            style={{
                              float: "right",
                              marginTop: "10px"
                            }}
                          >
                            {this.state.electionSnackbar_open ? (
                              <div
                                style={{
                                  backgroundColor: "#43a047",
                                  padding: "3px 16px",
                                  borderRadius: "5px",
                                  color: "white"
                                }}
                              >
                                <CheckCircleIcon />
                                <span> Updated Sucessfully</span>
                                <IconButton
                                  key="close"
                                  aria-label="close"
                                  color="inherit"
                                  onClick={e => {
                                    this.setState({
                                      electionSnackbar_open: false
                                    });
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

