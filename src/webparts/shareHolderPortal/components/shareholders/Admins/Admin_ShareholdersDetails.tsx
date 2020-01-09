import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import * as React from "react";
import { Link } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "../../common/common";
import styles from "../../shareholders/shareholders.module.scss";
import { AdminElections } from "../Admins/Admin_Elections";
import { AdminAccountInformation } from "./Admin_AccountInformation";
import { AdminDelegates } from "../Admins/Admin_Delegates";
import { AdminOtherInformation } from "../Admins/Admin_OtherInformation";
import { AdminDocuments } from "../Admins/Admin_Documents";
import { Web } from "@pnp/sp";
import List from "@material-ui/core/List";
import { ListItem, ListItemText, Card, CardContent } from "@material-ui/core";

export class AdminShareholdersDetails extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.state = {
      setIsOpen: false,
      value: 0,
      setValue: 0,
      generalInfoFrom: [],
      ShareholdingsCol: [],
      accountInformation: [],
      properties: this.props.properties,
      shareholderID: null,
      shareholdingName: ""
    };
  }

  public componentDidMount() {
    let params = window.location.hash.substring(
      window.location.hash.lastIndexOf("/") + 1
    );
    if (params) {
      this.getshareholdingName(params);
    }
  }

  public getshareholdingName = (id: any) => {
    if (id) {
      let newWeb = new Web(this.state.properties.tenentURL);
      newWeb.lists
        .getByTitle("Shareholdings")
        .items.select(
          "Title",
          "unrestrictedShares",
          "restrictedShares",
          "vestedOptions",
          "unvestedOptions",
          "shares",
          "options",
          "shareholderID"
        )
        .orderBy("Title", true)
        .top(1)
        .filter("shareholderID eq '" + id + "'")
        .get()
        .then(d => {
          if (d.length > 0) {
            this.setState({
              ShareholdingsCol: d[0],
              shareholderID: d[0].shareholderID,
              shareholdingName: d[0].Title
            });
          }
        });
    }
  }

  public tab_handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    this.setState({
      setValue: newValue,
      value: newValue
    });
  }

  public tab_handleChangeIndex = (index: number) => {
    this.setState({
      setValue: index,
      value: index
    });
  }

  public a11yProps = (index: any) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  public handleGeneralInfoChange = data => {
    this.setState({
      generalInfoFrom: data
    });
  }

  public commingSoon = () => {
    let _html = (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <br />
            <br />
            &nbsp;
          </div>
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <img
                src="https://wawadev.sharepoint.com/sites/RatnaDev/SiteAssets/ShareHolders/Coming-Soon-Banner.png"
                className="img-fluid"
                alt="Responsive image"
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public information = () => {
    let _html = (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3">
              <Card
                style={{
                  background: "white",
                  borderRadius: "5px",
                  margin: "5px"
                }}
              >
                <CardContent style={{padding:"8px"}}>
                  <h6
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "0.85rem"
                    }}
                  >
                    {this.state.ShareholdingsCol.Title}
                  </h6>
                  <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                    Account ID:{" "}
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {this.state.ShareholdingsCol.shareholderID}
                    </span>
                  </h6>
                </CardContent>
              </Card>
            </div>
            <div className="col-sm-5">&nbsp;</div>
            <div className="col-sm-2">
              <Card
                style={{
                  background: "white",
                  borderRadius: "5px",
                  margin: "5px"
                }}
              >
                <CardContent style={{padding:"8px"}}>
                  <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                    Total Options:{" "}
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {Math.trunc(this.state.ShareholdingsCol.options)}
                    </span>
                  </h6>
                  <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                    Vested:{" "}
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {this.state.ShareholdingsCol.vestedOptions}
                    </span>
                  </h6>
                  <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                    UnVested:{" "}
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {this.state.ShareholdingsCol.unvestedOptions}
                    </span>
                  </h6>
                </CardContent>
              </Card>
            </div>
            <div className="col-sm-2">
              <Card
                style={{
                  background: "white",
                  borderRadius: "5px",
                  margin: "5px"
                }}
              >
                <CardContent style={{padding:"8px"}}>
                  <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                    Total Shares:{" "}
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {Math.trunc(this.state.ShareholdingsCol.shares)}
                    </span>
                  </h6>
                  <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                    Unrestricted:{" "}
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {this.state.ShareholdingsCol.unrestrictedShares}
                    </span>
                  </h6>
                  <h6 style={{ color: "#484848", fontSize: "0.85rem" }}>
                    Restricted:{" "}
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {this.state.ShareholdingsCol.restrictedShares}
                    </span>
                  </h6>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return _html;
  }

  public tabs_HTML = () => {
    let commingSoon_HTML = this.commingSoon();
    let information_HTML = this.information();
    let tabs_HTML = (
      <div>
        {this.state.shareholderID !== undefined &&
        this.state.shareholderID !== null ? (
          <React.Fragment>
            <AppBar position="static" style={{background:"#eeeeee"}}>
              {information_HTML}
              <Tabs
                value={this.state.value}
                onChange={this.tab_handleChange}
                className={styles.tabsStyles}
              >
                <Tab label="Account Information" {...this.a11yProps(0)} />
                <Tab label="Equity Holdings" {...this.a11yProps(1)} />
                <Tab label="Elections" {...this.a11yProps(2)} />
                <Tab label="Delegates" {...this.a11yProps(3)} />
                <Tab label="Other Information" {...this.a11yProps(4)} />
                <Tab label="Documents" {...this.a11yProps(5)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              index={this.state.value}
              onChangeIndex={this.tab_handleChangeIndex}
            >
              <TabPanel value={this.state.value} index={0}>
                <AdminAccountInformation
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName
                  }}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={1}>
                {commingSoon_HTML}
              </TabPanel>
              <TabPanel value={this.state.value} index={2}>
                <AdminElections
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName
                  }}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={3}>
                <AdminDelegates
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName
                  }}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={4}>
                <AdminOtherInformation
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    shareholderID: this.state.shareholderID,
                    shareholdingName: this.state.shareholdingName
                  }}
                />
              </TabPanel>
              <TabPanel value={this.state.value} index={5}>
                <AdminDocuments
                  properties={{
                    tenentURL: this.state.properties.tenentURL,
                    AccountID: this.state.shareholderID
                  }}
                />
              </TabPanel>
            </SwipeableViews>
          </React.Fragment>
        ) : null}
      </div>
    );
    return tabs_HTML;
  }

  public render(): React.ReactElement<any> {
    let tabs_HTML = this.tabs_HTML();
    return (
      <div className={styles.shareholders}>
        <div className={styles.contentHead}>
          <h2>Shareholding Account Details</h2>
        </div>
        <div style={{ backgroundColor: "white" }}>
          <div
            style={{
              padding: "15px 0px",
              borderBottom: "2px solid #eee"
            }}
          >
            <Link
              style={{
                color: "#dc4848",
                cursor: "pointer",
                padding: "5px;"
              }}
              to="/adminShareholdings"
            >
              <KeyboardArrowLeftIcon style={{ fontSize: "2em" }} /> View all
              Shareholdings
            </Link>
          </div>
        </div>
        <div>{tabs_HTML}</div>
      </div>
    );
  }
}
