import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SendIcon from "@material-ui/icons/Send";
import { Web } from "@pnp/sp";
import * as React from "react";
import {
  CustomButton,
  CustomRadio,
  CustomTextField,
  ErrorButton,
  SucessButton,
  Transition
} from "../../common/common";
import styles from "../shareholders.module.scss";
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class AdminDelegates extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.getAccountInfromation = this.getAccountInfromation.bind(this);
    this.snackbar_handleClose = this.snackbar_handleClose.bind(this);
    this.handleEditAccessChange = this.handleEditAccessChange.bind(this);
    this.handleDeleteAccessChange = this.handleDeleteAccessChange.bind(this);
    this.state = {
      properties: this.props.properties,
      delegateInformation: [],
      shareHoldingInfromation: [],
      deligateRequestCol: [],
      delegateExist: 0,
      shareholderID: this.props.properties.shareholderID,
      isInviteDeligates: false,
      delegateAccess: "Read Only",
      updatedDelegateAccess: "Read Only",
      delegateEmailAddress: "",
      delegateEmailAddress_Error: false,
      deligateFirstName: "",
      deligateFirstName_Error: false,
      deligateLastName: "",
      deligateLastName_Error: false,
      delegateSnackbar_open: false,
      editSnackbar_open: false,
      isDialog_Open: false,
      isApprove_Open: false,
      approval_sucessMessage:false,
      approvalDeligate: [],
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
    if (this.state.shareholderID !== undefined) {
      this.getAccountInfromation(this.state.shareholderID);
      this.getdeligateRequest(this.state.shareholderID);
    }
  }

  public getdeligateRequest(id): any {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      //const filter = "shareholderID eq '" + id + "";
      const filter = "shareholderID eq " + id + " and Status eq 'Requested'";
      newWeb.lists
        .getByTitle("Shareholding Delegates Request")
        .items.select(
          "Title",
          "ShareholderType",
          "shares",
          "shareholderEmail",
          "shareholderID",
          "firstName",
          "Status",
          "lastName",
          "aceessType",
          "unrestrictedShares",
          "restrictedShares",
          "vestedOptions",
          "unvestedOptions",
          "ID"
        )
        .orderBy("ID", true)
        .filter(filter)
        .get()
        .then(d => {
          if (d.length > 0) {
            this.setState(prevState => ({
              ...prevState,
              deligateRequestCol: d
            }));
          } else {
            this.setState(prevState => ({
              ...prevState,
              deligateRequestCol: []
            }));
          }
        });
    }
  }

  public getAccountInfromation(id): any {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      //const filter = "shareholderID eq '" + id + "'";
      const filter = "shareholderID eq " + id + "'";
      newWeb.lists
        .getByTitle("Shareholdings")
        .items.select(
          "Title",
          "ShareholderType",
          "shareholderEmail",
          "shareholderID",
          "shares",
          "firstName",
          "lastName",
          "aceessType",
          "unrestrictedShares",
          "restrictedShares",
          "vestedOptions",
          "unvestedOptions",
          "ID"
        )
        .orderBy("ID", true)
        .filter(filter)
        .get()
        .then(d => {
          if (d.length > 0) {
            let shareholderObj = [];
            let delegateObj = [];
            for (let index = 0; index < d.length; index++) {
              if (d[index].ShareholderType === "Delegate") {
                delegateObj.push({
                  Title: d[index].Title,
                  ShareholderType: d[index].ShareholderType,
                  shares: d[index].shares,
                  shareholderEmail: d[index].shareholderEmail,
                  shareholderID: d[index].shareholderID,
                  firstName: d[index].firstName,
                  lastName: d[index].lastName,
                  aceessType: d[index].aceessType,
                  unrestrictedShares: d[index].unrestrictedShares,
                  restrictedShares: d[index].restrictedShares,
                  vestedOptions: d[index].vestedOptions,
                  unvestedOptions: d[index].unvestedOptions,
                  ID: d[index].ID
                });
              } else {
                shareholderObj.push({
                  Title: d[index].Title,
                  ShareholderType: d[index].ShareholderType,
                  shares: d[index].shares,
                  shareholderEmail: d[index].shareholderEmail,
                  shareholderID: d[index].shareholderID,
                  firstName: d[index].firstName,
                  lastName: d[index].lastName,
                  aceessType: d[index].aceessType,
                  unrestrictedShares: d[index].unrestrictedShares,
                  restrictedShares: d[index].restrictedShares,
                  vestedOptions: d[index].vestedOptions,
                  unvestedOptions: d[index].unvestedOptions,
                  ID: d[index].ID
                });
              }
            }
            this.setState(prevState => ({
              ...prevState,
              delegateInformation: delegateObj,
              shareHoldingInfromation: shareholderObj
            }));
          } else {
            this.setState(prevState => ({
              ...prevState,
              delegateInformation: [],
              shareHoldingInfromation: []
            }));
          }
        });
    }
  }

  public updateDeligate = () => {
    if (this.state.currentItem.ID) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholdings")
        .items.getById(this.state.currentItem.ID)
        .update({
          aceessType: this.state.updatedDelegateAccess.toString()
        })
        .then(i => {
          this.setState({
            isAccessDialog_Open: false,
            editSnackbar_open: true
          });
          this.getAccountInfromation(this.state.shareholderID);
          setTimeout(() => {
            this.setState({ editSnackbar_open: false });
          }, 5000);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  public deleteDeligate = () => {
    if (this.state.currentItem.ID) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholdings")
        .items.getById(this.state.currentItem.ID)
        .delete()
        .then(i => {
          this.setState({
            isAccessDialog_Open: false,
            editSnackbar_open: true
          });
          this.getAccountInfromation(this.state.shareholderID);
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
      updatedDelegateAccess: item.aceessType,
      isAccessDialog_type: "Edit",
      currentItem: item
    });
  }

  public handleDeleteAccessChange(item) {
    this.setState({
      isAccessDialog_Open: true,
      updatedDelegateAccess: item.aceessType,
      isAccessDialog_type: "Delete",
      currentItem: item
    });
  }

  public handleApprovelDeligate = (item: any) => {
    this.setState({
      approvalDeligate: item,
      isApprove_Open:true,
      approval_sucessMessage:false
    });
    console.log(this.state);
  }

  public validateSendIvite = () => {
    let error = {
      delegateEmailAddress_Error: this.state.delegateEmailAddress_Error,
      deligateFirstName_Error: this.state.deligateFirstName_Error,
      deligateLastName_Error: this.state.deligateLastName_Error
    };

    if (this.state.delegateEmailAddress === "") {
      this.setState({ delegateEmailAddress_Error: true });
      error.delegateEmailAddress_Error = true;
    } else {
      error.delegateEmailAddress_Error = false;
    }

    if (this.state.deligateFirstName === "") {
      this.setState({ deligateFirstName_Error: true });
      error.deligateFirstName_Error = true;
    } else {
      error.deligateFirstName_Error = false;
    }

    if (this.state.deligateLastName === "") {
      this.setState({ deligateLastName_Error: true });
      error.deligateLastName_Error = true;
    } else {
      error.deligateLastName_Error = false;
    }

    const identifiers = Object.keys(error);
    const activeError = identifiers.filter((id) => {
      return error[id];
    });
    if (activeError.length === 0) {
      this.requestNewDeliagte();
    }
  }

  public requestNewDeliagte = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Delegates Request")
      .items.add({
        Title: this.state.shareHoldingInfromation[0].Title,
        shareholderID: this.state.shareholderID,
        shares: this.state.shareHoldingInfromation[0].shares.toString(),
        shareholderEmail: this.state.delegateEmailAddress.toString(),
        ShareholderType:"Delegate",
        unrestrictedShares:
          this.state.shareHoldingInfromation[0].unrestrictedShares !== null
            ? this.state.shareHoldingInfromation[0].unrestrictedShares.toString()
            : null,
        restrictedShares:
          this.state.shareHoldingInfromation[0].restrictedShares.toString !==
          null
            ? this.state.shareHoldingInfromation[0].restrictedShares.toString()
            : null,
        vestedOptions:
          this.state.shareHoldingInfromation[0].vestedOptions !== null
            ? this.state.shareHoldingInfromation[0].vestedOptions.toString()
            : null,
        unvestedOptions:
          this.state.shareHoldingInfromation[0].unvestedOptions !== null
            ? this.state.shareHoldingInfromation[0].unvestedOptions.toString()
            : null,
        firstName: this.state.deligateName.toString(),
        lastName: this.state.deligateName.toString(),
        aceessType: this.state.delegateAccess.toString()
      })
      .then(i => {
        this.setState({ delegateSnackbar_open: true, submitted: false });
      })
      .catch(e => {
        console.log(e);
      });
  }

  public approveRequestedDeliagte = () => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.add({
        Title: this.state.approvalDeligate.Title,
        shareholderID: this.state.shareholderID,
        shares: this.state.approvalDeligate.shares.toString(),
        shareholderEmail: this.state.approvalDeligate.shareholderEmail.toString(),
        ShareholderType: "Delegate",
        unrestrictedShares:
          this.state.approvalDeligate.unrestrictedShares !== null
            ? this.state.approvalDeligate.unrestrictedShares.toString()
            : null,
        restrictedShares:
          this.state.approvalDeligate.restrictedShares.toString !== null
            ? this.state.approvalDeligate.restrictedShares.toString()
            : null,
        vestedOptions:
          this.state.approvalDeligate.vestedOptions !== null
            ? this.state.approvalDeligate.vestedOptions.toString()
            : null,
        unvestedOptions:
          this.state.approvalDeligate.unvestedOptions !== null
            ? this.state.approvalDeligate.unvestedOptions.toString()
            : null,
        firstName: this.state.approvalDeligate.firstName.toString(),
        lastName: this.state.approvalDeligate.lastName.toString(),
        aceessType: this.state.approvalDeligate.aceessType.toString()
      })
      .then(i => {
        this.updateShareholdingDelegatesRequest(this.state.approvalDeligate);
      })
      .catch(e => {
        console.log(e);
      });
  }

  public updateShareholdingDelegatesRequest =(e) => {
    let newWeb = new Web(this.state.properties.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Delegates Request")
      .items.getById(e.ID)
      .update({
        Status: "Completed"
      })
      .then(i => {
        this.setState({ approval_sucessMessage: true }, () => {
          this.getAccountInfromation(this.state.shareholderID);
          this.getdeligateRequest(this.state.shareholderID);
        });
      })
      .catch((ex) => {
        console.log(ex);
      });
  }

  public inviteNewDeligate = () => {
    let _html = (
      <React.Fragment>
        <div className="col-lg-12">
          <div style={{ padding: "15px 0px" }}>
            <Paper>
              <CustomButton
                type="button"
                onClick={e =>
                  this.setState({
                    isInviteDeligates: !this.state.isInviteDeligates
                  })
                }
                className={`btn-block`}
                style={{ display: "block", margin: "auto" }}
              >
                Invite New Delegate
              </CustomButton>
              {this.state.isInviteDeligates ? (
                <div style={{ backgroundColor: "#eee" }}>
                  <div className="row-fluid">
                    <div className="col-md-12">
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <CustomTextField
                          label="Delegate Email Address*"
                          name="delegateEmailAddress"
                          value={this.state.delegateEmailAddress}
                          onChange={e => {
                            if (e.target.value === "") {
                              this.setState({
                                delegateEmailAddress: e.target.value,
                                delegateEmailAddress_Error: true
                              });
                            } else {
                              this.setState({
                                delegateEmailAddress: e.target.value,
                                delegateEmailAddress_Error: false
                              });
                            }
                          }}
                          helperText={
                            this.state.delegateEmailAddress_Error === true
                              ? "Delegate Email Address Cannot be Empty"
                              : null
                          }
                          error={this.state.delegateEmailAddress_Error}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <CustomTextField
                          label="Delegate First Name*"
                          onChange={e => {
                            if (e.target.value === "") {
                              this.setState({
                                deligateFirstName: e.target.value,
                                deligateFirstName_Error: true
                              });
                            } else {
                              this.setState({
                                deligateFirstName: e.target.value,
                                deligateFirstName_Error: false
                              });
                            }
                          }}
                          name="deligateFirstName"
                          value={this.state.deligateFirstName}
                          helperText={
                            this.state.deligateFirstName_Error === true
                              ? "Delegate First Name Cannot be Empty"
                              : null
                          }
                          error={this.state.deligateFirstName_Error}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ margin: "10px" }}>
                        <CustomTextField
                          label="Delegate Last Name*"
                          onChange={e => {
                            if (e.target.value === "") {
                              this.setState({
                                deligateLastName: e.target.value,
                                deligateLastName_Error: true
                              });
                            } else {
                              this.setState({
                                deligateLastName: e.target.value,
                                deligateLastName_Error: false
                              });
                            }
                          }}
                          name="deligateLastName"
                          value={this.state.deligateLastName}
                          helperText={
                            this.state.deligateLastName_Error === true
                              ? "Delegate Last Name Cannot be Empty"
                              : null
                          }
                          error={this.state.deligateLastName_Error}
                        />
                      </FormControl>
                      <FormControl style={{ margin: "10px" }}>
                        <FormLabel
                          style={{ color: "#976340" }}
                          component="legend"
                        >
                          Access
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-label="position"
                          value={this.state.delegateAccess}
                          defaultValue="Read Only"
                          name="customized-radios"
                          //onChange={this.handleChange.bind(this)}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
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
                          }}
                        >
                          <FormControlLabel
                            value="Read Only"
                            control={<CustomRadio />}
                            label="Read Only"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="Full Access"
                            control={<CustomRadio />}
                            label="Full Access"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="Email Only"
                            control={<CustomRadio />}
                            label="Email Only"
                            labelPlacement="end"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className="row-fluid" style={{ marginTop: "10px" }}>
                    <div className="col-md-12">
                      <CustomButton
                        style={{
                          marginRight: "10px",
                          marginBottom: "10px"
                        }}
                        onClick={e => {
                          this.validateSendIvite();
                        }}
                      >
                        <SendIcon fontSize="default" />
                        {(this.state.submitted && "Information Sent!") ||
                          (!this.state.submitted && " Send Invite")}
                      </CustomButton>
                      <CustomButton
                        style={{ marginBottom: "10px" }}
                        onClick={e =>
                          this.setState({
                            isInviteDeligates: !this.state.isInviteDeligates
                          })
                        }
                      >
                        <CancelIcon fontSize="default" />
                        Cancle
                      </CustomButton>
                      <div
                        style={{
                          float: "right"
                        }}
                      >
                        {this.state.delegateSnackbar_open ? (
                          <div
                            style={{
                              backgroundColor: "#43a047",
                              padding: "3px 16px",
                              color: "white",
                              borderRadius: "5px"
                            }}
                          >
                            <CheckCircleIcon />
                            <span>
                              {" "}
                              Invite Sent Shareholders Office Sucessfully
                            </span>
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
                </div>
              ) : null}
            </Paper>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public conditionalDialogs = () => {
    let _html = (
      <React.Fragment>
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
                backgroundColor: "#976340",
                boxShadow: "0 5px 5px 0 rgba(0,0,0,.75)",
                padding: "10px",
                marginBottom: "15px"
              }}
            >
              Are you sure you want to grant full access to this Delegate?
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
              <div className="alert alert-danger" style={{ marginBottom: "0" }}>
                <p
                  style={{ fontSize: "14px", margin: "0" }}
                  className={`${styles.electionsGeneralText} text-justify`}
                >
                  Full access means the Delegate is able to change Account
                  Information (emails, addresses) and otherwise act on your
                  behalf within this Portal (with the exception of inviting
                  other Delegates on your behalf). Please consider carefully
                  before confirming.
                </p>
              </div>
            </DialogContent>
            <DialogActions style={{ padding: "15px" }}>
              <ErrorButton
                onClick={e => {
                  this.setState({
                    isDialog_Open: !this.state.isDialog_Open,
                    delegateAccess: "Read Only"
                  });
                }}
              >
                <CancelIcon style={{ marginRight: "5px" }} /> Disagree
              </ErrorButton>
              <SucessButton
                onClick={e => {
                  this.setState({
                    isDialog_Open: !this.state.isDialog_Open,
                    delegateAccess: "Full Access"
                  });
                }}
              >
                <CheckCircleIcon style={{ marginRight: "5px" }} />
                Agree
              </SucessButton>
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
                backgroundColor: "#976340",
                boxShadow: "0 5px 5px 0 rgba(0,0,0,.75)",
                padding: "10px",
                marginBottom: "15px"
              }}
            >
              {this.state.isAccessDialog_type === "Edit" ? (
                <React.Fragment>Edit Delegate Access Level</React.Fragment>
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
                    <FormLabel component="legend" style={{ color: "black" }}>
                      Please Edit Access
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      value={this.state.updatedDelegateAccess}
                      name="dialog-radios"
                      onChange={e => {
                        this.setState({
                          updatedDelegateAccess: e.target.value
                        });
                      }}
                    >
                      <FormControlLabel
                        value="Read Only"
                        control={<CustomRadio />}
                        label="Read Only"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="Full Access"
                        control={<CustomRadio />}
                        label="Full Access"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="Email Only"
                        control={<CustomRadio />}
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
                    They will no longer be able to access your Shareholding
                    information.
                    <br />
                  </div>
                  <div>
                    Note that if this Delegate still has access to other
                    Shareholdings of yours, they will still have access to them
                    until Removed for those Shareholdings.
                  </div>
                </DialogContent>
              </React.Fragment>
            )}
            {this.state.isAccessDialog_type === "Edit" ? (
              <React.Fragment>
                <DialogActions style={{ padding: "15px" }}>
                  <ErrorButton
                    onClick={e => {
                      this.setState({
                        isAccessDialog_Open: !this.state.isAccessDialog_Open
                      });
                    }}
                  >
                    <CancelIcon style={{ marginRight: "5px" }} /> Close
                  </ErrorButton>
                  <SucessButton
                    onClick={e => {
                      this.updateDeligate();
                    }}
                  >
                    <CheckCircleIcon style={{ marginRight: "5px" }} />
                    Update
                  </SucessButton>
                </DialogActions>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <DialogActions style={{ padding: "15px" }}>
                  <ErrorButton
                    onClick={e => {
                      this.setState({
                        isAccessDialog_Open: !this.state.isAccessDialog_Open
                      });
                    }}
                  >
                    <CancelIcon style={{ marginRight: "5px" }} /> Close
                  </ErrorButton>
                  <SucessButton
                    onClick={e => {
                      this.deleteDeligate();
                    }}
                  >
                    <DeleteIcon style={{ marginRight: "5px" }} />
                    Remove Deligate
                  </SucessButton>
                </DialogActions>
              </React.Fragment>
            )}
          </Dialog>
        </div>
        <div className="row">
          <Dialog
            disableBackdropClick
            open={this.state.isApprove_Open}
            onClose={e => {
              this.setState({
                isApprove_Open: !this.state.isApprove_Open
              });
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
              style={{
                color: "#ffff",
                backgroundColor: "#976340",
                boxShadow: "0 5px 5px 0 rgba(0,0,0,.75)",
                padding: "10px",
                marginBottom: "15px"
              }}
            >
              Are you sure you want to Approve this Delegate?
              <a
                style={{
                  color: "white",
                  float: "right",
                  cursor: "pointer"
                }}
                onClick={e => {
                  this.setState({
                    isApprove_Open: !this.state.isApprove_Open
                  });
                }}
              >
                <CloseIcon />
              </a>
            </DialogTitle>
            <DialogContent>
              <div className="row">
                <div className="col-sm-12">
                  <FormControl style={{ margin: "10px" }}>
                    <FormLabel>
                      Shareholding Name : {this.state.approvalDeligate.Title}
                    </FormLabel>
                  </FormControl>
                </div>
                <div className="col-sm-12">
                  <FormControl style={{ margin: "10px" }}>
                    <FormLabel>
                      Shareholder ID :{" "}
                      {this.state.approvalDeligate.shareholderID}
                    </FormLabel>
                  </FormControl>
                </div>
                <div className="col-sm-12">
                  <FormControl style={{ margin: "10px" }}>
                    <FormLabel>
                      Deligate Full Name Type :{" "}
                      {this.state.approvalDeligate.firstName}{" "}
                      {this.state.approvalDeligate.lastName}
                    </FormLabel>
                  </FormControl>
                </div>
                <div className="col-sm-12">
                  <FormControl style={{ margin: "10px" }}>
                    <FormLabel>
                      Deligate Email :{" "}
                      {this.state.approvalDeligate.shareholderEmail}
                    </FormLabel>
                  </FormControl>
                </div>
                <div className="col-sm-12">
                  <FormControl style={{ margin: "10px" }}>
                    <FormLabel>
                      Request Type :{" "}
                      {this.state.approvalDeligate.ShareholderType}
                    </FormLabel>
                  </FormControl>
                </div>
                <div className="col-sm-12">
                  <FormControl style={{ margin: "10px" }}>
                    <FormLabel>
                      Aceess Type : {this.state.approvalDeligate.aceessType}
                    </FormLabel>
                  </FormControl>
                </div>
                {this.state.approval_sucessMessage !== false ? (
                  <div className="col-sm-12">
                    <FormControl
                      style={{
                        margin: "10px",
                        background: "#28a745",
                        color: "white",
                        padding: "15px 10px 5px 10px",
                        borderRadius: "5px"
                      }}
                    >
                      <FormLabel style={{ color: "white"}}>
                        Deligate Request Approved Successfully
                      </FormLabel>
                    </FormControl>
                  </div>
                ) : null}
              </div>
            </DialogContent>
            <DialogActions style={{ padding: "15px" }}>
              <ErrorButton
                onClick={e => {
                  this.setState({
                    isApprove_Open: !this.state.isApprove_Open
                  });
                }}
              >
                <CancelIcon style={{ marginRight: "5px" }} /> Cancel
              </ErrorButton>
              <SucessButton
                onClick={e => {
                  this.approveRequestedDeliagte();
                }}
              >
                <CheckCircleIcon style={{ marginRight: "5px" }} />
                Approve
              </SucessButton>
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public render(): React.ReactElement<any> {
    let inviteNewDeligate = this.inviteNewDeligate();
    let conditionalDialogs = this.conditionalDialogs();
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
                    {this.state.delegateInformation.length > 0 ? (
                      <Paper>
                        <Table
                          className={styles.table}
                          aria-label="simple table"
                        >
                          <TableHead className={styles.tableHead}>
                            <TableRow>
                              <TableCell align="left">Name</TableCell>
                              <TableCell align="left">E-mail Address</TableCell>
                              <TableCell align="left">Access</TableCell>
                              <TableCell align="left">Edit</TableCell>
                              <TableCell align="left">Remove</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.delegateInformation.map((item, i) => {
                              return (
                                <TableRow key={i}>
                                  <TableCell component="th" scope="row">
                                    {item.firstName} {item.lastName}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item.shareholderEmail}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item.aceessType}
                                  </TableCell>
                                  <TableCell align="left">
                                    <a
                                      onClick={() => {
                                        this.handleEditAccessChange(item);
                                      }}
                                      className={styles.editLink}
                                    >
                                      <FontAwesomeIcon
                                        style={{
                                          marginLeft: "3px",
                                          color: "#976340",
                                          fontSize: "14px",
                                          marginRight: "3px"
                                        }}
                                        icon={faPenSquare}
                                      />
                                      Edit
                                    </a>
                                  </TableCell>
                                  <TableCell align="left">
                                    <a
                                      onClick={() => {
                                        this.handleDeleteAccessChange(item);
                                      }}
                                      className={styles.deleteLink}
                                    >
                                      <FontAwesomeIcon
                                        style={{
                                          marginLeft: "3px",
                                          color: "#dc3545",
                                          fontSize: "14px",
                                          marginRight: "3px"
                                        }}
                                        icon={faTrashAlt}
                                      />{" "}
                                      Remove
                                    </a>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Paper>
                    ) : null}
                    {this.state.deligateRequestCol.length > 0 ? (
                      <React.Fragment>
                         <br />
                      </React.Fragment>):null}
                    {this.state.deligateRequestCol.length > 0 ? (
                      <Paper>
                        <Typography
                          style={{
                            background: "#976340",
                            color: "white",
                            padding: "6px",
                            borderRadius: "5px 5px 0px 0px",
                            fontSize: "16px"
                          }}
                          variant="h6"
                          component="h6"
                        >
                          New Delegate Request
                        </Typography>
                        <Table
                          className={styles.table}
                          aria-label="simple table"
                        >
                          <TableHead className={styles.tableHead}>
                            <TableRow>
                              <TableCell align="left">
                                New Deligate Name
                              </TableCell>
                              <TableCell align="left">E-mail Address</TableCell>
                              <TableCell align="left">Access</TableCell>
                              <TableCell align="left">Approve</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.deligateRequestCol.map((item, i) => {
                              return (
                                <TableRow key={i}>
                                  <TableCell component="th" scope="row">
                                    {item.firstName} {item.lastName}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item.shareholderEmail}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item.aceessType}
                                  </TableCell>
                                  <TableCell align="left">
                                    <a
                                      onClick={() => {
                                        this.handleApprovelDeligate(item);
                                      }}
                                      className={styles.editLink}
                                    >
                                      <CheckCircleIcon fontSize="small" /> Approve{" "}
                                      {/* <span
                                        style={{
                                          fontWeight: "bold"
                                        }}
                                      >
                                        {" "}
                                        /
                                      </span> */}
                                    </a>
                                    {/* <a
                                      onClick={() => {
                                        this.handleDeleteAccessChange(item);
                                      }}
                                      className={styles.deleteLink}
                                    >
                                      <DeleteIcon fontSize="small" /> Remove
                                    </a> */}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Paper>
                    ) : null}
                    <React.Fragment>
                      <div className="row">
                        <div className="col-md-6 offset-md-6">
                          <br />
                          {this.state.editSnackbar_open ? (
                            <div
                              style={{
                                backgroundColor: "#43a047",
                                padding: "3px 16px",
                                color: "white",
                                float: "right",
                                borderRadius: "5px"
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
                                  this.setState({
                                    editSnackbar_open: false
                                  });
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
                <div className="row">{inviteNewDeligate}</div>
                <div className="row">{conditionalDialogs}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}