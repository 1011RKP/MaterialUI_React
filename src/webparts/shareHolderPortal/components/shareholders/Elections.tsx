import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import { sp, Web } from "@pnp/sp";
import * as React from "react";
import { state_DD } from "../common/common";
import styles from "./shareholders.module.scss";

export class Elections extends React.Component<any, any> {
  public electionRef = React.createRef<HTMLFormElement>();

  public constructor(props: any, state: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.addElectiondataTolist = this.addElectiondataTolist.bind(this);
    this.getAccountInfromation = this.getAccountInfromation.bind(this);
    this.snackbar_handleClose = this.snackbar_handleClose.bind(this);
    this.onLoadSetStateOptions = this.onLoadSetStateOptions.bind(this);
    this.info_html = this.info_html.bind(this);
    this.state = {
      properties: this.props.properties,
      electionInformation: [],
      state_DD: state_DD,
      state_slected: "none",
      years_DD: [],
      ele_taxYear: "none",
      de_Val: "none",
      md_Val: "none",
      pa_Val: "none",
      va_Val: "none",
      nj_Val: "none",
      de_disabled: false,
      md_disabled: false,
      nj_disabled: false,
      pa_disabled: false,
      va_disabled: false,
      submitted: false,
      hasError: false,
      electionSnackbar_open: false
    };
  }

  public getTaxyears() {
    const currentDate = new Date();
    let currentYear = Number(currentDate.getFullYear());
    let years = [
      {
        key: Number(new Date().getFullYear()),
        text: Number(new Date().getFullYear())
      }
    ];
    for (let index = 0; index < 4; index++) {
      currentYear--;
      years.push({
        key: currentYear,
        text: currentYear
      });
    }
    this.setState({
      years_DD: years
    });
    console.log(this.state.years_DD);
  }

  public info_html() {
    let check = (
      <React.Fragment>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-5">
            <FormControl
              error={this.state.ele_taxYear === "error"}
              fullWidth
              style={{ margin: "10px", color: "black" }}
            >
              <InputLabel className={styles.genralinputColor} id="tax-year">
                Tax Year*{" "}
              </InputLabel>
              <Select
                className={styles.genralinputColor}
                name="ele_taxYear"
                value={this.state.ele_taxYear ? this.state.ele_taxYear : "none"}
                onChange={e =>
                  this.setState(
                    {
                      ele_taxYear: e.target.value
                    },
                    () => {
                      console.log(this.state.ele_taxYear);
                    }
                  )
                }
              >
                {this.state.years_DD.map(item => {
                  return (
                    <MenuItem key={item.length} value={item.text}>
                      {item.text}
                    </MenuItem>
                  );
                })}
                {/* {this.state.ele_taxYear === "error" ? (
                  <FormHelperText>Year is required!</FormHelperText>
                ) : null} */}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-5">
            <FormControl
              fullWidth
              error={this.state.state_slected === "error"}
              style={{ margin: "10px" }}
            >
              <InputLabel
                className={styles.genralinputColor}
                id="state-for-state-tax"
              >
                Resident State for State Taxes*
              </InputLabel>
              <Select
                labelId="state-for-state-tax"
                input={<Input />}
                name="dma_State"
                className={styles.genralinputColor}
                onChange={this.onStateChange.bind(this)}
                value={this.state.state_slected}
              >
                {this.state.state_DD.map((item, i) => {
                  return (
                    <MenuItem key={i} value={item.key}>
                      {item.text}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                error={this.state.de_Val === "error"}
                fullWidth
                component="fieldset"
              >
                <FormLabel component="legend">Delaware*</FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.de_Val}
                  onChange={e => {
                    this.setState({
                      de_Val: e.target.value
                    });
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<Radio color="primary" />}
                    label="In"
                    disabled={this.state.de_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<Radio color="primary" />}
                    label="Out"
                    disabled={this.state.de_disabled}
                    labelPlacement="end"
                  />
                  {/* {this.state.de_Val === "error" ? (
                    <FormHelperText>State is required!</FormHelperText>
                  ) : null} */}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Florida*</FormLabel>
              <InputLabel disabled>Not applicable</InputLabel>
            </FormControl>
          </div>
          <div className="col-md-4">
            <FormControl
              component="fieldset"
              error={this.state.md_Val === "error"}
              fullWidth
            >
              <FormLabel component="legend">Maryland*</FormLabel>
              <RadioGroup
                row
                aria-label="position"
                defaultValue="none"
                name="position"
                value={this.state.md_Val}
                onChange={e => {
                  this.setState({
                    md_Val: e.target.value
                  });
                }}
              >
                <FormControlLabel
                  value="In"
                  control={<Radio color="primary" />}
                  label="In"
                  disabled={this.state.md_disabled}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="Out"
                  control={<Radio color="primary" />}
                  label="Out"
                  disabled={this.state.md_disabled}
                  labelPlacement="end"
                />
                {/* {this.state.md_Val === "error" ? (
                  <FormHelperText>State is required!</FormHelperText>
                ) : null} */}
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                error={this.state.nj_Val === "error"}
                component="fieldset"
                fullWidth
              >
                <FormLabel component="legend">New Jersey *</FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.nj_Val}
                  onChange={e => {
                    this.setState({
                      nj_Val: e.target.value
                    });
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<Radio color="primary" />}
                    label="In"
                    disabled={this.state.nj_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<Radio color="primary" />}
                    label="Out"
                    disabled={this.state.nj_disabled}
                    labelPlacement="end"
                  />
                  {/* {this.state.nj_Val === "error" ? (
                    <br/>
                    <FormHelperText>State is required!</FormHelperText>
                  ) : null}*/}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ margin: "0px 10px" }}>
              <FormControl
                component="fieldset"
                fullWidth
                error={this.state.pa_Val === "error"}
              >
                <FormLabel component="legend">Pennsylvania*</FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="none"
                  value={this.state.pa_Val}
                  onChange={e => {
                    this.setState({
                      pa_Val: e.target.value
                    });
                  }}
                >
                  <FormControlLabel
                    value="In"
                    control={<Radio color="primary" />}
                    label="In"
                    disabled={this.state.pa_disabled}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Out"
                    control={<Radio color="primary" />}
                    label="Out"
                    disabled={this.state.pa_disabled}
                    labelPlacement="end"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="col-md-4">
            <FormControl
              component="fieldset"
              fullWidth
              error={this.state.va_Val === "error"}
            >
              <FormLabel component="legend">Virginia*</FormLabel>
              <RadioGroup
                row
                aria-label="position"
                defaultValue="none"
                name="position"
                value={this.state.va_Val}
                onChange={e => {
                  this.setState({
                    va_Val: e.target.value
                  });
                }}
              >
                <FormControlLabel
                  value="In"
                  control={<Radio color="primary" />}
                  label="In"
                  disabled={this.state.va_disabled}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="Out"
                  control={<Radio color="primary" />}
                  label="Out"
                  disabled={this.state.va_disabled}
                  labelPlacement="end"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ margin: "15px 0px" }}>
          <div className="col-md-4">
            <FormControl component="fieldset" fullWidth>
              <FormLabel className={styles.genralinputColor} component="legend">
                Federal*
              </FormLabel>
              <InputLabel className={styles.genralinputColor} disabled>
                Not applicable
              </InputLabel>
            </FormControl>
          </div>
        </div>
      </React.Fragment>
    );
    return check;
  }

  public onStateChange(e) {
    let selectedState = e.target.value;
    this.setState({});
    switch (selectedState) {
      case "Delaware":
        this.setState({
          state_slected: selectedState,
          de_Val: "Out",
          de_disabled: true,
          md_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: false
        });
        break;
      case "Maryland":
        this.setState({
          state_slected: selectedState,
          md_Val: "Out",
          md_disabled: true,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: false
        });
        break;
      case "New Jersey":
        this.setState({
          state_slected: selectedState,
          nj_Val: "Out",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: true,
          pa_disabled: false,
          va_disabled: false
        });
        break;
      case "Pennsylvania":
        this.setState({
          state_slected: selectedState,
          pa_Val: "Out",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: true,
          va_disabled: false
        });
        break;
      case "Virginia":
        this.setState({
          state_slected: selectedState,
          va_Val: "Out",
          md_disabled: false,
          de_disabled: false,
          nj_disabled: false,
          pa_disabled: false,
          va_disabled: true
        });
        break;
    }
  }

  public componentDidMount() {
    this.getTaxyears();
    if (this.state.properties.accountID !== undefined) {
      this.getAccountInfromation(this.state.properties.AccountID);
    }
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
            this.setState(
              {
                electionInformation: d[0],
                ele_taxYear: d[0].TaxYear !== null ? d[0].TaxYear : "none",
                state_slected:
                  d[0].StateforStateTaxes !== null
                    ? d[0].StateforStateTaxes
                    : "none",
                de_Val: d[0].Delaware !== null ? d[0].Delaware : "none",
                md_Val: d[0].Maryland !== null ? d[0].Maryland : "none",
                nj_Val: d[0].NewJersey !== null ? d[0].NewJersey : "none",
                pa_Val: d[0].Pennsylvania !== null ? d[0].Pennsylvania : "none",
                va_Val: d[0].Virginia !== null ? d[0].Virginia : "none"
              },
              () => {
                this.onLoadSetStateOptions();
              }
            );
          }
        });
    }
  }

  public onLoadSetStateOptions() {
    let selectedState = this.state.state_slected;
    switch (selectedState) {
      case "Delaware":
        this.setState({
          de_Val: "Out",
          de_disabled: true
        });
        break;
      case "Maryland":
        this.setState({
          md_Val: "Out",
          md_disabled: true
        });
        break;
      case "New Jersey":
        this.setState({
          nj_Val: "Out",
          nj_disabled: true
        });
        break;
      case "Pennsylvania":
        this.setState({
          pa_Val: "Out",
          pa_disabled: true
        });
        break;
      case "Virginia":
        this.setState({
          va_Val: "Out",
          va_disabled: true
        });
        break;
    }
  }

  public handleChange = event => {
    const { formData } = this.state;
    console.log(event.target.value);
    formData[event.target.name] = event.target.value;
    this.setState({ formData });
  }

  public snackbar_handleClose() {
    this.setState({ ...this.state, snackbar_open: false });
  }

  public addElectiondataTolist = () => {
    this.setState({ submitted: true }, () => {
      sp.web.lists
        .getByTitle("Shareholding Elections")
        .items.getById(this.state.electionInformation.ID)
        .update({
          TaxYear: this.state.ele_taxYear.toString(),
          StateforStateTaxes: this.state.state_slected.toString(),
          Delaware: this.state.de_Val.toString(),
          Maryland: this.state.md_Val.toString(),
          NewJersey: this.state.nj_Val.toString(),
          Pennsylvania: this.state.pa_Val.toString(),
          Virginia: this.state.va_Val.toString(),
          Florida:"N/A"
        })
        .then(i => {
          this.setState({
            electionSnackbar_open: true,
            submitted: false
          });
          console.log(i);
        });
    });
  }

  public validateElection() {
    let formValues = this.state;
    const errorObj = [];
    Object.keys(this.state).forEach((key, index) => {
      if (this.state[key] === "none") {
        errorObj.push({ [key]: this.state[key] });
        this.setState({ [key]: "error" }, () => {
          console.log(this.state);
        });
      }
    });
    console.log(errorObj);
    console.log(this.state);
    if (errorObj.length <= 0) {
      this.addElectiondataTolist();
    }
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
                          <Button
                            color="primary"
                            // variant="raised"
                            type="button"
                            className={`${styles.electionSubmitBtn} fixed-bottom`}
                            onClick={this.validateElection.bind(this)}
                          >
                            <CheckCircleIcon fontSize="default" />{" "}
                            {(this.state.submitted && "Election Submitted!") ||
                              (!this.state.submitted && "Submit Election")}
                          </Button>
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
                                  padding: "6px 16px",
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
