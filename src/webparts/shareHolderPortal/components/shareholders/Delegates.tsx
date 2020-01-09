import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import { Transition } from "../common/common";
import { Web } from "@pnp/sp";
import * as React from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import styles from "./shareholders.module.scss";

export class Delegates extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.addNewDeligate = this.addNewDeligate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAccountInfromation = this.getAccountInfromation.bind(this);
    this.snackbar_handleClose = this.snackbar_handleClose.bind(this);
    this.handleEditAccessChange = this.handleEditAccessChange.bind(this);
    this.updateDeligate = this.updateDeligate.bind(this);
    this.deleteDeligate = this.deleteDeligate.bind(this);
    this.handleDeleteAccessChange = this.handleDeleteAccessChange.bind(this);
    this.state = {
      properties: this.props.properties,
      delegateInformation: [],
      delegateExist: 0,
      AccountID: this.props.properties.AccountID,
      isInviteDeligates: false,
      delegateAccess: "Read Only",
      updatedDelegateAccess: "Read Only",
      delegateEmailAddress: "",
      deligateName: "",
      delegateSnackbar_open: false,
      editSnackbar_open: false,
      isDialog_Open: false,
      isAccessDialog_Open: false,
      isAccessDialog_type: "Edit",
      submitted: false,
      currentItem: []
    };
  }
  public snackbar_handleClose() {
    this.setState({ ...this.state, delegateSnackbar_open: false });
  }

  public componentDidMount() {
    if (this.state.AccountID !== undefined) {
      this.getAccountInfromation(this.state.AccountID);
    }
  }

  public getAccountInfromation(id): any {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      const filter = "Title eq '" + id + "' and accountType eq 'Delegate'";
      newWeb.lists
        .getByTitle("Shareholding User Details")
        .items.select(
          "Title",
          "fullName",
          "email",
          "accountType",
          "accessType",
          "ID"
        )
        .orderBy("Title", true)
        .filter(filter)
        .get()
        .then(d => {
          if (d.length > 0) {
            this.setState(prevState => ({
              ...prevState,
              delegateInformation: d
            }));
          }
          else{
            this.setState(prevState => ({
              ...prevState,
              delegateInformation: []
            }));
          }
        });
    }
  }

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = (event.target as HTMLInputElement).value;
    if (val === "Full Access") {
      this.setState({
        isDialog_Open: true
      });
    } else {
      this.setState({
        delegateAccess: val
      });
    }
  }

  public updateDeligate() {
    if (this.state.currentItem.ID) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholding User Details")
        .items.getById(this.state.currentItem.ID)
        .update({
          accessType: this.state.updatedDelegateAccess.toString()
        })
        .then(i => {
          this.setState({
            isAccessDialog_Open: false,
            editSnackbar_open: true
          });
          this.getAccountInfromation(this.state.AccountID);
          setTimeout(() => {
            this.setState({ editSnackbar_open: false });
          }, 5000);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  public deleteDeligate() {
    if (this.state.currentItem.ID) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholding User Details")
        .items.getById(this.state.currentItem.ID)
        .delete()
        .then(i => {
          this.setState({
            isAccessDialog_Open: false,
            editSnackbar_open: true
          });
          this.getAccountInfromation(this.state.AccountID);
          setTimeout(() => {
            this.setState({ editSnackbar_open: false });
          }, 5000);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  public handleEditAccessChange(item) {
    this.setState({
      isAccessDialog_Open: true,
      updatedDelegateAccess: item.accessType,
      isAccessDialog_type: "Edit",
      currentItem: item
    });
  }

  public handleDeleteAccessChange(item) {
    this.setState({
      isAccessDialog_Open: true,
      updatedDelegateAccess: item.accessType,
      isAccessDialog_type: "Delete",
      currentItem: item
    });
  }

  public handleSubmit() {
    this.setState({ submitted: true }, () => {
      this.addNewDeligate();
    });
  }

  public addNewDeligate() {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Delegates")
      .items.add({
        Title: this.state.AccountID,
        DelegateEmail: this.state.delegateEmailAddress.toString(),
        DelegateName: this.state.deligateName.toString(),
        DelegateAccess: this.state.delegateAccess.toString()
      })
      .then(i => {
        this.setState({ delegateSnackbar_open: true, submitted: false });
      })
      .catch(e => {
        console.log(e);
      });
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.shareholders}>
        <div className={styles.delegates}>
          <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
            <div className="card">
              <div className={`card-body`}>
                <div className={`${styles.cardHead_General} card-header`}>
                  <h6>Shareholding Delegates</h6>
                </div>
                <div className="row">
                  <div className="alert">
                    <p
                      className={`${styles.electionsGeneralText} text-justify`}
                    >
                      Delegates are people such as trustees, accountants,
                      lawyers, or your family members who you allow to access
                      this Shareholding information. All Delegates are able to
                      see all the pages and documents for this Shareholding,
                      except for listing of Delegates you invited. Delegates to
                      whom you give Full Access also have the ability to act on
                      your behalf within this Portal – they can change
                      information such as the email or mailing addresses.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <Paper>
                      <Table className={styles.table} aria-label="simple table">
                        <TableHead className={styles.tableHead}>
                          <TableRow>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">E-mail Address</TableCell>
                            <TableCell align="left">Company Name</TableCell>
                            <TableCell align="left">Access</TableCell>
                            <TableCell align="left"> &nbsp;</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.delegateInformation.length > 0
                            ? this.state.delegateInformation.map((item, i) => {
                                return (
                                  <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                      {item.fullName}
                                    </TableCell>
                                    <TableCell align="left">
                                      {item.email}
                                    </TableCell>
                                    <TableCell align="left">&nbsp;</TableCell>
                                    <TableCell align="left">
                                      {item.accessType}
                                    </TableCell>
                                    <TableCell align="left">
                                      <a
                                        onClick={() => {
                                          this.handleEditAccessChange(item);
                                        }}
                                        className={styles.editLink}
                                      >
                                        <EditIcon fontSize="small" /> Edit{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                          {" "}
                                          /
                                        </span>
                                      </a>{" "}
                                      <a
                                        onClick={() => {
                                          this.handleDeleteAccessChange(item);
                                        }}
                                        className={styles.deleteLink}
                                      >
                                        <DeleteIcon fontSize="small" /> Remove
                                      </a>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            : null}
                        </TableBody>
                      </Table>
                    </Paper>
                    <React.Fragment>
                      <div className="row">
                        <div className="col-md-6 offset-md-6">
                          <br />
                          {this.state.editSnackbar_open ? (
                            <div
                              style={{
                                backgroundColor: "#43a047",
                                padding: "6px 16px",
                                color: "white",
                                float: "right"
                              }}
                            >
                              <CheckCircleIcon />

                              <span>
                                Access Successfully Changed to{" "}
                                {this.state.updatedDelegateAccess}
                              </span>
                              <IconButton
                                key="close"
                                aria-label="close"
                                color="inherit"
                                onClick={() => {
                                  this.setState({ editSnackbar_open: false });
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </React.Fragment>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div style={{ padding: "15px 0px" }}>
                      <Paper>
                        <Button
                          color="primary"
                          variant="contained"
                          type="button"
                          onClick={e =>
                            this.setState({
                              isInviteDeligates: !this.state.isInviteDeligates
                            })
                          }
                          className={`${styles.inviteBtn} btn-block`}
                          style={{ display: "block", margin: "auto" }}
                        >
                          Invite New Delegate
                        </Button>
                        {this.state.isInviteDeligates ? (
                          <div style={{ backgroundColor: "#eee" }}>
                            <ValidatorForm
                              ref="form"
                              onSubmit={this.handleSubmit.bind(this)}
                              className={styles.shareholders}
                            >
                              <div className="row-fluid">
                                <div className="col-md-12">
                                  <FormControl
                                    fullWidth
                                    style={{ margin: "10px" }}
                                    // className={styles.inputColor}
                                  >
                                    <TextValidator
                                      label="Delegate Email Address*"
                                      name="delegateEmailAddress"
                                      value={this.state.delegateEmailAddress}
                                      onChange={e => {
                                        this.setState({
                                          delegateEmailAddress: e.target.value
                                        });
                                      }}
                                      className={styles.inputClass}
                                      validators={["required", "isEmail"]}
                                      errorMessages={[
                                        "this field is required",
                                        "email is not valid"
                                      ]}
                                    />
                                  </FormControl>
                                  <FormControl
                                    fullWidth
                                    style={{ margin: "10px" }}
                                  >
                                    <TextValidator
                                      label="Delegate Name*"
                                      onChange={e => {
                                        this.setState({
                                          deligateName: e.target.value
                                        });
                                      }}
                                      className={styles.inputClass}
                                      name="deligateName"
                                      value={this.state.deligateName}
                                      validators={["required"]}
                                      errorMessages={["this field is required"]}
                                    />
                                  </FormControl>
                                  <FormControl style={{ margin: "10px" }}>
                                    <FormLabel component="legend">
                                      Access
                                    </FormLabel>
                                    <RadioGroup
                                      row
                                      aria-label="position"
                                      value={this.state.delegateAccess}
                                      defaultValue="Read Only"
                                      name="customized-radios"
                                      onChange={this.handleChange.bind(this)}
                                    >
                                      <FormControlLabel
                                        value="Read Only"
                                        control={<Radio color="primary" />}
                                        label="Read Only"
                                        labelPlacement="end"
                                      />
                                      <FormControlLabel
                                        value="Full Access"
                                        control={<Radio color="primary" />}
                                        label="Full Access"
                                        labelPlacement="end"
                                      />
                                      <FormControlLabel
                                        value="Email Only"
                                        control={<Radio color="primary" />}
                                        label="Email Only"
                                        labelPlacement="end"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </div>
                              </div>
                              <div
                                className="row-fluid"
                                style={{ marginTop: "10px" }}
                              >
                                <div className="col-md-12">
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    //disabled={submitted}
                                    className={styles.delegateBtns}
                                    style={{ marginRight: "10px" }}
                                  >
                                    <SendIcon fontSize="default" />
                                    {(this.state.submitted &&
                                      "Information Sent!") ||
                                      (!this.state.submitted && " Send Invite")}
                                  </Button>
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    className={styles.delegateBtns}
                                    onClick={e =>
                                      this.setState({
                                        isInviteDeligates: !this.state
                                          .isInviteDeligates
                                      })
                                    }
                                  >
                                    <CancelIcon fontSize="default" />
                                    Cancle
                                  </Button>
                                  <div
                                    style={{
                                      float: "right"
                                    }}
                                  >
                                    {this.state.delegateSnackbar_open ? (
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
                                          onClick={this.snackbar_handleClose}
                                        >
                                          <CloseIcon />
                                        </IconButton>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </ValidatorForm>
                          </div>
                        ) : null}
                      </Paper>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <Dialog
                    disableBackdropClick
                    open={this.state.isDialog_Open}
                    onClose={e => {
                      this.setState({
                        isDialog_Open: !this.state.isDialog_Open,
                        delegateAccess: "Read Only"
                      });
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle
                      id="alert-dialog-title"
                      style={{
                        color: "#ffff",
                        backgroundColor: "#0c69cc",
                        boxShadow: "0 5px 5px 0 rgba(0,0,0,.75)",
                        padding: "10px",
                        marginBottom: "15px"
                      }}
                    >
                      Are you sure you want to grant full access to this
                      Delegate?
                      <a
                        style={{
                          color: "white",
                          float: "right",
                          cursor: "pointer"
                        }}
                        onClick={e => {
                          this.setState({
                            isDialog_Open: !this.state.isDialog_Open,
                            delegateAccess: "Read Only"
                          });
                        }}
                      >
                        <CloseIcon />
                      </a>
                    </DialogTitle>
                    <DialogContent>
                      <div
                        className="alert alert-danger"
                        style={{ marginBottom: "0" }}
                      >
                        <p
                          style={{ fontSize: "14px", margin: "0" }}
                          className={`${styles.electionsGeneralText} text-justify`}
                        >
                          Full access means the Delegate is able to change
                          Account Information (emails, addresses) and otherwise
                          act on your behalf within this Portal (with the
                          exception of inviting other Delegates on your behalf).
                          Please consider carefully before confirming.
                        </p>
                      </div>
                    </DialogContent>
                    <DialogActions style={{ padding: "15px" }}>
                      <Button
                        onClick={e => {
                          this.setState({
                            isDialog_Open: !this.state.isDialog_Open,
                            delegateAccess: "Read Only"
                          });
                        }}
                        style={{ backgroundColor: "#0c69cc", color: "#ffff" }}
                      >
                        <CancelIcon style={{ marginRight: "5px" }} /> Disagree
                      </Button>
                      <Button
                        onClick={e => {
                          this.setState({
                            isDialog_Open: !this.state.isDialog_Open,
                            delegateAccess: "Full Access"
                          });
                        }}
                        style={{ backgroundColor: "#e53935", color: "#ffff" }}
                      >
                        <CheckCircleIcon style={{ marginRight: "5px" }} />
                        Agree
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
                <div className="row">
                  <Dialog
                    TransitionComponent={Transition}
                    onClose={() => {
                      this.setState({
                        isAccessDialog_Open: false
                      });
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.isAccessDialog_Open}
                  >
                    <DialogTitle
                      id="alert-dialog-title"
                      style={{
                        color: "#ffff",
                        backgroundColor: "#0c69cc",
                        boxShadow: "0 5px 5px 0 rgba(0,0,0,.75)",
                        padding: "10px",
                        marginBottom: "15px"
                      }}
                    >
                      {this.state.isAccessDialog_type === "Edit" ? (
                        <React.Fragment>
                          Edit Delegate Access Level
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          Are you sure you want to remove Delegate?
                        </React.Fragment>
                      )}
                      <a
                        style={{
                          color: "white",
                          float: "right",
                          cursor: "pointer"
                        }}
                        onClick={e => {
                          this.setState({
                            isAccessDialog_Open: !this.state.isAccessDialog_Open
                          });
                        }}
                      >
                        <CloseIcon />
                      </a>
                    </DialogTitle>
                    {this.state.isAccessDialog_type === "Edit" ? (
                      <React.Fragment>
                        <DialogContent>
                          <FormControl style={{ margin: "10px" }}>
                            <FormLabel
                              component="legend"
                              style={{ color: "black" }}
                            >
                              Please Edit Access
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              value={this.state.updatedDelegateAccess}
                              defaultValue="Read Only"
                              name="dialog-radios"
                              onChange={e => {
                                this.setState({
                                  updatedDelegateAccess: e.target.value
                                });
                              }}
                            >
                              <FormControlLabel
                                value="Read Only"
                                control={<Radio color="primary" />}
                                label="Read Only"
                                labelPlacement="end"
                              />
                              <FormControlLabel
                                value="Full Access"
                                control={<Radio color="primary" />}
                                label="Full Access"
                                labelPlacement="end"
                              />
                              <FormControlLabel
                                value="Email Only"
                                control={<Radio color="primary" />}
                                label="Email Only"
                                labelPlacement="end"
                              />
                            </RadioGroup>
                          </FormControl>
                        </DialogContent>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <DialogContent>
                          <div>
                            They will no longer be able to access your
                            Shareholding information.
                            <br />
                          </div>
                          <div>
                            Note that if this Delegate still has access to other
                            Shareholdings of yours, they will still have access
                            to them until Removed for those Shareholdings.
                          </div>
                        </DialogContent>
                      </React.Fragment>
                    )}
                    {this.state.isAccessDialog_type === "Edit" ? (
                      <React.Fragment>
                        <DialogActions style={{ padding: "15px" }}>
                          <Button
                            onClick={e => {
                              this.setState({
                                isAccessDialog_Open: !this.state
                                  .isAccessDialog_Open
                              });
                            }}
                            style={{
                              backgroundColor: "#0c69cc",
                              color: "#ffff"
                            }}
                          >
                            <CancelIcon style={{ marginRight: "5px" }} /> Close
                          </Button>
                          <Button
                            onClick={this.updateDeligate}
                            style={{
                              backgroundColor: "#e53935",
                              color: "#ffff"
                            }}
                          >
                            <CheckCircleIcon style={{ marginRight: "5px" }} />
                            Update
                          </Button>
                        </DialogActions>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <DialogActions style={{ padding: "15px" }}>
                          <Button
                            onClick={e => {
                              this.setState({
                                isAccessDialog_Open: !this.state
                                  .isAccessDialog_Open
                              });
                            }}
                            style={{
                              backgroundColor: "#0c69cc",
                              color: "#ffff"
                            }}
                          >
                            <CancelIcon style={{ marginRight: "5px" }} /> Close
                          </Button>
                          <Button
                            onClick={this.deleteDeligate}
                            style={{
                              backgroundColor: "#e53935",
                              color: "#ffff"
                            }}
                          >
                            <DeleteIcon style={{ marginRight: "5px" }} />
                            Remove Deligate
                          </Button>
                        </DialogActions>
                      </React.Fragment>
                    )}
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
