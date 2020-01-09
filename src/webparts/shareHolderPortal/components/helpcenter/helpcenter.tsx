import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  FormLabel,
  Snackbar,
  SnackbarContent,
  TextareaAutosize,
  TextField,
  Typography,
  FormHelperText
} from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import CancelIcon from "@material-ui/icons/Cancel";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveIcon from "@material-ui/icons/Save";
import { ItemAddResult, Web } from "@pnp/sp";
import { CustomTextField, CustomButton } from "../common/common";
import * as React from "react";
import styles from "./helpcenter.module.scss";

export class HelpCenter extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      properties: this.props.properties,
      faqCollection: [],
      expanded: "",
      isExpanded: false,
      subject: "",
      message: "",
      error: false,
      tenentURL: this.props.properties.tenentURL,
      open: false,
      openPopover: false,
      subject_Error:false,
      message_Error:false
    };
  }

  public componentDidMount() {
    this.setState(
      {
        tenentURL: this.state.tenentURL + "/sites/vti_ww_00_9292_spfx/"
      },
      () => {
        let newWeb = new Web(this.state.tenentURL);
        this.getFAQS(newWeb);
      }
    );
  }

  public getFAQS = newWeb => {
    newWeb.lists
      .getByTitle("Shareholding Help Center")
      .items.select("Title", "answer", "ID")
      .orderBy("ID", true)
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState(prevState => ({
            ...prevState,
            faqCollection: d
          }));
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isitExpanded: boolean
  ) => {
    console.log(panel, isitExpanded);
    this.setState({
      expanded: panel,
      isExpanded: isitExpanded
    });
  }

  public handleSubmit = () => {
    let error = {
      subject_Error: this.state.subject_Error,
      message_Error: this.state.message_Error
    };

    if (this.state.subject === "") {
      this.setState({ subject_Error: true });
      error.subject_Error = true;
    } else {
      error.subject_Error = false;
    }
    if (this.state.message === "") {
      this.setState({ message_Error: true });
      error.message_Error = true;
    } else {
      error.message_Error = false;
    }
    const identifiers = Object.keys(error);
    const activeError = identifiers.filter((id) => {
      return error[id];
    });
    if (activeError.length === 0) {
      this.postNewQuestion();
    }
  }

  public postNewQuestion = () => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Help Request")
      .items.add({
        Title: this.state.subject,
        message: this.state.message
      })
      .then((iar: ItemAddResult) => {
        this.setState({
          open: !this.state.open,
          subject: null,
          message: null
        });
      })
      .catch(e => {
        console.error(e);
      });
  }

  public adminLink = () => {
    let adminLink = (
      <React.Fragment>
        {this.state.openPopover === true ? (
          <div className={styles.popOverMessage}>
            Click to Add/Edit Help Center content
          </div>
        ) : null}
        <div style={{ marginTop: "-30px", float: "right" }}>
          <div
            onMouseEnter={() => {
              this.setState({
                openPopover: true
              });
            }}
            onMouseLeave={() => {
              this.setState({
                openPopover: false
              });
            }}
          >
            <a
              href="/sites/vti_ww_00_9292_spfx/ShareholdingHelpCenter/Allitemsg.aspx"
              target="_blank"
            >
              <VerifiedUserIcon style={{ color: "#fff9ff" }} />
            </a>
          </div>
        </div>
      </React.Fragment>
    );

    return adminLink;
  }

  public render(): React.ReactElement<any> {
    const error = this.state.error;
    let adminLink = this.adminLink();
    return (
      <div className={styles.helpCenter}>
        <div className={styles.contentHead}>
          <h2>Frequently Asked Questions</h2>
          {this.state.properties.isCurrentUserAdmin === true ? (
            <div>{adminLink}</div>
          ) : null}
        </div>
        <div className="row-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className={`card-body`}>
                  <div className="row-fluid" style={{ marginTop: "10px" }}>
                    {this.state.faqCollection.map(faqs => {
                      return (
                        <ExpansionPanel
                          expanded={this.state.expanded === faqs.ID}
                          onChange={this.handleChange(faqs.ID)}
                        >
                          <ExpansionPanelSummary
                            expandIcon={
                              <ExpandMoreIcon
                                style={{ color: "rgb(0, 120, 212)" }}
                              />
                            }
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                          >
                            <Typography
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#0078d4"
                              }}
                            >
                              {faqs.Title}
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: faqs.answer
                              }}
                            ></div>
                            {/* <Typography>{faqs.answer}</Typography> */}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">&nbsp;</div>
          </div>
        </div>
        <div
          className="row-fluid"
          style={{ padding: "20px", overflow: "hidden" }}
        >
          <div className="row" style={{ paddingTop: "10px" }}>
            <div className="col-md-12">
              <div className="card">
                <div className={`card-body`}>
                  <div className={`${styles.cardHead_General} card-header`}>
                    <h6>Still Have Questions or Concerns?</h6>
                  </div>
                  <div className="row-fluid">
                    <div className="col-md-12" style={{ marginTop: "10px" }}>
                      <div
                        className="alert alert-info"
                        style={{
                          margin: "0px",
                          padding: "10px 5px 0px 5px"
                        }}
                      >
                        <p>
                          Send us a note and we will get back to you through
                          your Profile email address as soon as possible.
                        </p>
                      </div>
                      <div
                        className="alert"
                        style={{ margin: "0px", padding: "0" }}
                      >
                        <div className="row-fluid">
                          <div className="col-md-12">
                            <FormControl fullWidth>
                              <CustomTextField
                                label="Subject*"
                                onChange={e => {
                                  if (e.target.value !== null) {
                                    this.setState({
                                      subject: e.target.value,
                                      subject_Error:false
                                    });
                                  } else {
                                    this.setState({
                                      subject: e.target.value,
                                      subject_Error:true
                                    });
                                  }
                                }}
                                name="subject"
                                value={this.state.subject}
                                helperText={
                                  this.state.subject_Error === true
                                    ? "Subject Cannot be Empty"
                                    : null
                                }
                                error={this.state.subject_Error}
                              />
                            </FormControl>
                            <FormControl
                              fullWidth
                              style={{ marginTop: "10px" }}
                            >
                              <FormLabel
                              style={{color: this.state.message_Error !== true ? "#976340" : "red"}}
                              >Message*</FormLabel>
                              <TextareaAutosize
                                rows={6}
                                rowsMax={6}
                                onChange={e => {
                                  if (e.target.value !== null) {
                                    this.setState({
                                      message: e.target.value,
                                      message_Error:false
                                    });
                                  } else {
                                    this.setState({
                                      message: e.target.value,
                                      message_Error:true
                                    });
                                  }
                                }}
                                name="message"
                                value={this.state.message}
                                className={
                                  this.state.message_Error
                                    ? styles.errorTextarea
                                    : null
                                }
                              />
                              {this.state.message_Error !== false ? (
                                <FormHelperText style={{color:"#f44336"}}>
                                  Message Cannot be Empty
                                </FormHelperText>
                              ) : (
                                false
                              )}
                            </FormControl>
                          </div>
                          <div className="col-md-12">&nbsp;</div>
                          <div className="col-md-12">
                            <p style={{ color: "red", float: "left" }}>
                              * Required Fields
                            </p>
                            <CustomButton
                              type="button"
                              className="float-right"
                              disabled={this.state.submitted}
                              onClick={this.handleSubmit.bind(this)}
                            >
                              <SaveIcon fontSize="default" /> {""}Submit
                            </CustomButton>
                            <Snackbar
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right"
                              }}
                              autoHideDuration={4000}
                              open={this.state.open}
                              ContentProps={{
                                "aria-describedby": "message-id"
                              }}
                            >
                              <SnackbarContent
                                className={styles.snackbarSucess}
                                message={
                                  <div id="message-id">
                                    <CheckCircleIcon
                                      style={{
                                        marginRight: "5px!important"
                                      }}
                                    />
                                    Your New Question was sent to
                                    SharehlderPortal Sucessfully
                                    <CancelIcon
                                      style={{
                                        marginLeft: "50px!important",
                                        cursor: "pointer"
                                      }}
                                      onClick={e => {
                                        this.setState({
                                          open: false
                                        });
                                      }}
                                    />
                                  </div>
                                }
                              ></SnackbarContent>
                            </Snackbar>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
