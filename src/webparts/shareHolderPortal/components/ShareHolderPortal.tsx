import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Paper from "@material-ui/core/Paper";
import { MuiThemeProvider, ThemeProvider } from "@material-ui/core/styles";
import DescriptionIcon from "@material-ui/icons/Description";
import HelpIcon from "@material-ui/icons/Help";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import PieChartIcon from "@material-ui/icons/PieChart";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { SPComponentLoader } from "@microsoft/sp-loader";
//import { sp } from "@pnp/sp";
import { Web } from "@pnp/pnpjs";
import "babel-polyfill";
import "es6-promise";
import * as jQuery from "jquery";
import { Panel } from "office-ui-fabric-react/lib/Panel";
import * as React from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import { AdminReportsHome } from "./adminReports/AdminReportsHome";
import { shareholderInputTheam } from "./common/common";
import { AdminDashBoard } from "./dashboard/admin_Dashboard";
import { DashBoard } from "./dashboard/dashboard";
import { AdmindocumentsandForms } from "./documentsandforms/admin_documentsandForms";
import { DocumentsandForms } from "./documentsandforms/documentsandforms";
import { HelpCenter } from "./helpcenter/helpcenter";
import { IShareHolderPortalProps } from "./IShareHolderPortalProps";
import styles from "./ShareHolderPortal.module.scss";
import { AdminShareholdersDetails } from "./shareholders/Admins/Admin_ShareholdersDetails";
import { AdminShareholdings } from "./shareholders/Admins/Admin_Shareholdings";
import { MyShareholdings } from "./shareholders/MyShareholdings";
import { MyShareholdingsDetails } from "./shareholders/MyShareholdingsDetails";


SPComponentLoader.loadCss(
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
);

export default class ShareHolderPortal extends React.Component<
  IShareHolderPortalProps,
  any
> {

  public constructor(props: IShareHolderPortalProps, state: any) {
    super(props);
    this.state = {
      shareholdingCollection: [],
      setIsOpen: false,
      value: 0,
      setValue: 0,
      view_ShareholdersDetails: false,
      context: this.props.context,
      accountEmail: null,
      shareholderID: null,
      newWeb: null,
      tenentURL: null,
      isCurrentUserAdmin: false,
      currentUserPermissions: ""
    };
  }

  public componentDidMount() {
    let siteURL = this.props.context.pageContext.web.absoluteUrl;
    let tenentUrl = siteURL.substring(0, siteURL.indexOf("sites/") - 1);
    this.setState({ tenentURL: tenentUrl }, () => {
      this.loggedInUserAccountID();
    });
  }

  public openPanel = () => {
    this.setState({
      setIsOpen: true
    });
  }

  public dismissPanel = () => {
    this.setState({
      setIsOpen: false
    });
  }

  public loggedInUserAccountID = () => {
    let newWeb = new Web(this.props.context.pageContext.web.absoluteUrl);
    let restFullURL = this.props.siteurl + "/_api/web/currentuser";
    let userID;
    this.props.spHttpClient
      .get(restFullURL, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response
          .json()
          .then((responseJSON: any) => {
            const accountEmail = responseJSON["UserPrincipalName"];
            userID = responseJSON["Id"];
            this.setState(
              {
                accountEmail: accountEmail,
                newWeb: this.props.context.pageContext.web.absoluteUrl
              },
              () => {
                let url =
                  this.props.siteurl +
                  "/_api/web/sitegroups/getbyname('WawaSPAdmin')/Users?$filter=Id eq " +
                  userID;
                this.props.spHttpClient
                  .get(url, SPHttpClient.configurations.v1)
                  .then((res: SPHttpClientResponse) => {
                    res.json().then((r: any) => {
                      if (r.value.length > 0) {
                        this.setState(
                          {
                            isCurrentUserAdmin: true,
                            shareholderID: ""
                          }
                          // ,
                          // () => {
                          //   this.getAdminShareholdingDetails();
                          // }
                        );
                      } else {
                        this.setState(
                          {
                            isCurrentUserAdmin: false,
                            shareholderID: ""
                          }
                          // ,
                          // () => {
                          //   this.getEndUserDetails();
                          // }
                        );
                      }
                    });
                  });
              }
            );
          })
          .catch(e => {
            console.error(e);
          });
      });
  }

  public getEndUserDetails = () => {
    let newWeb = new Web(this.state.tenentURL + "/sites/vti_ww_00_9292_spfx/");
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.select(
        "ID",
        "Title",
        "shares",
        "options",
        "shareholderID",
        "shareholderEmail",
        "unrestrictedShares",
        "restrictedShares",
        "vestedOptions",
        "unvestedOptions",
        "aceessType"
      )
      .orderBy("Title", true)
      .filter("shareholderEmail eq '" + this.state.accountEmail + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState(prevState => ({
            ...prevState,
            shareholdingCollection: d
          }));
        } else {
          this.setState(prevState => ({
            ...prevState,
            shareholdingCollection: [0]
          }));
        }
        console.log(this.state);
      })
      .catch(e => {
        console.error(e);
      });
  }

  public render(): React.ReactElement<IShareHolderPortalProps> {
    jQuery("#workbenchPageContent").attr("style", "max-width:100%!important");
    jQuery(".SPCanvas-canvas").attr("style", "max-width:100%!important");
    jQuery(".CanvasZone").attr("style", "max-width:100%!important");

    return (
      <div className={styles.shareHolderPortal}>
        <div className={styles.root}>
          {this.state.shareholderID !== null ? (
            <ThemeProvider theme={shareholderInputTheam}>
              <Grid container spacing={3}>
                <Router>
                  <div className="hidden-md-up">
                    <Hidden only={["lg", "md", "xl"]}>
                      <Grid item xs={12} sm={12}>
                        <Paper className={styles.paper}>
                          <a
                            onClick={this.openPanel}
                            style={{ float: "right" }}
                          >
                            <MenuIcon fontSize="large" />
                          </a>
                          <Panel
                            isOpen={this.state.setIsOpen}
                            onDismiss={this.dismissPanel}
                            isLightDismiss={true}
                            headerText="Panel - Small, left-aligned, fixed"
                          >
                            <List component="nav">
                              <React.Fragment>
                                {this.state.isCurrentUserAdmin !== true ? (
                                  <React.Fragment>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Link className={styles.linkto} to="/">
                                          <HomeIcon fontSize="default" />
                                          DashBoard
                                        </Link>
                                      </ListItemIcon>
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Link
                                          className={styles.linkto}
                                          to={{
                                            pathname: `/myShareholdings`
                                          }}
                                        >
                                          <PieChartIcon fontSize="default" />
                                          Shareholdings
                                        </Link>
                                      </ListItemIcon>
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Link
                                          className={styles.linkto}
                                          to="/documentsandforms"
                                        >
                                          <DescriptionIcon fontSize="default" />
                                          Documents and Forms
                                        </Link>
                                      </ListItemIcon>
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Link
                                          className={styles.linkto}
                                          to="/helpCenter"
                                        >
                                          <HelpIcon fontSize="default" />
                                          HelpCenter
                                        </Link>
                                      </ListItemIcon>
                                    </ListItem>
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Link className={styles.linkto} to="/">
                                          <HomeIcon fontSize="default" />
                                          DashBoard
                                        </Link>
                                      </ListItemIcon>
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Link
                                          className={styles.linkto}
                                          to="/adminDocumentsandForms"
                                        >
                                          <DescriptionIcon fontSize="default" />
                                          Documents and Forms
                                        </Link>
                                      </ListItemIcon>
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Link
                                          className={styles.linkto}
                                          to="/helpCenter"
                                        >
                                          <HelpIcon fontSize="default" />
                                          HelpCenter
                                        </Link>
                                      </ListItemIcon>
                                    </ListItem>
                                  </React.Fragment>
                                )}
                              </React.Fragment>
                            </List>
                          </Panel>
                        </Paper>
                      </Grid>
                    </Hidden>
                  </div>
                  <Hidden only={["sm", "xs"]}>
                    <Grid
                      item
                      lg={2}
                      md={2}
                      className={styles.container_lg_sideNavigation}
                    >
                      <List component="nav">
                        <React.Fragment>
                          {this.state.isCurrentUserAdmin !== true ? (
                            <React.Fragment>
                              <ListItem>
                                <ListItemIcon>
                                  <Link className={styles.linkto} to="/">
                                    <HomeIcon fontSize="default" />
                                    DashBoard
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    to={{
                                      pathname: `/myShareholdings`
                                    }}
                                  >
                                    <PieChartIcon fontSize="default" />
                                    Shareholdings
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    to="/documentsandforms"
                                  >
                                    <DescriptionIcon fontSize="default" />
                                    Documents and Forms
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    to="/helpCenter"
                                  >
                                    <HelpIcon fontSize="default" />
                                    HelpCenter
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <ListItem>
                                <ListItemIcon>
                                  <Link className={styles.linkto} to="/">
                                    <HomeIcon fontSize="default" />
                                    DashBoard
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    to={{
                                      pathname: `/adminShareholdings`
                                    }}
                                  >
                                    <PieChartIcon fontSize="default" />
                                    Shareholdings
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    to="/adminDocumentsandForms"
                                  >
                                    <DescriptionIcon fontSize="default" />
                                    Documents and Forms
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    to="/helpCenter"
                                  >
                                    <HelpIcon fontSize="default" />
                                    HelpCenter
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Link
                                    className={styles.linkto}
                                    to="/adminReportsHome"
                                  >
                                    <DescriptionIcon fontSize="default" />
                                    Admin Reports
                                  </Link>
                                </ListItemIcon>
                              </ListItem>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      </List>
                    </Grid>
                  </Hidden>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={10}
                    lg={10}
                    xl={10}
                    className={styles.container_lg_contentArea}
                  >
                    {this.state.isCurrentUserAdmin !== true ? (
                      <Switch>
                        <Route
                          exact
                          path="/"
                          render={props => (
                            <DashBoard
                              properties={{
                                tenentURL:
                                  this.state.tenentURL +
                                  "/sites/vti_ww_00_9292_spfx/",
                                accountEmail: this.state.accountEmail
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/myShareholdings"
                          render={props => (
                            <MyShareholdings
                              properties={{
                                tenentURL:
                                  this.state.tenentURL +
                                  "/sites/vti_ww_00_9292_spfx/",
                                accountEmail: this.state.accountEmail
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/documentsandforms"
                          render={props => (
                            <DocumentsandForms
                              properties={{
                                tenentURL:
                                  this.state.tenentURL +
                                  "/sites/vti_ww_00_9292_spfx/",
                                accountEmail: this.state.accountEmail
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/helpCenter"
                          render={props => (
                            <HelpCenter
                              properties={{
                                newWeb: this.state.newWeb,
                                accountID: this.state.shareholderID,
                                accountEmail: this.state.accountEmail,
                                tenentURL: this.state.tenentURL,
                                isCurrentUserAdmin: this.state
                                  .isCurrentUserAdmin,
                                currentUserPermissions: ""
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/myShareholdingsDetails/:accountID"
                          render={props => (
                            <MyShareholdingsDetails
                              properties={{
                                tenentURL:
                                  this.state.tenentURL +
                                  "/sites/vti_ww_00_9292_spfx/",
                                accountEmail: this.state.accountEmail
                              }}
                            />
                          )}
                        />
                      </Switch>
                    ) : (
                      <Switch>
                        <Route
                          exact
                          path="/"
                          render={props => (
                            <AdminDashBoard
                              properties={{
                                newWeb: this.state.newWeb,
                                tenentURL:
                                  this.state.tenentURL +
                                  "/sites/vti_ww_00_9292_spfx/"
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/adminShareholdings"
                          render={props => (
                            <AdminShareholdings
                              properties={{
                                tenentURL:
                                  this.state.tenentURL +
                                  "/sites/vti_ww_00_9292_spfx/"
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/adminDocumentsandForms"
                          render={props => (
                            <AdmindocumentsandForms
                              properties={{
                                newWeb: this.state.newWeb,
                                accountID: this.state.shareholderID,
                                accountEmail: this.state.accountEmail,
                                tenentURL: this.state.tenentURL,
                                isCurrentUserAdmin: this.state
                                  .isCurrentUserAdmin
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/helpCenter"
                          render={props => (
                            <HelpCenter
                              properties={{
                                newWeb: this.state.newWeb,
                                accountID: this.state.shareholderID,
                                accountEmail: this.state.accountEmail,
                                tenentURL: this.state.tenentURL,
                                isCurrentUserAdmin: this.state
                                  .isCurrentUserAdmin,
                                currentUserPermissions: ""
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/adminReportsHome"
                          render={props => (
                            <AdminReportsHome
                              properties={{
                                newWeb: this.state.newWeb,
                                accountID: this.state.shareholderID,
                                accountEmail: this.state.accountEmail,
                                tenentURL:
                                  this.state.tenentURL +
                                  "/sites/vti_ww_00_9292_spfx/",
                                isCurrentUserAdmin: this.state
                                  .isCurrentUserAdmin,
                                currentUserPermissions: ""
                              }}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/adminShareholdersDetails/:accountID"
                          render={props => (
                            <AdminShareholdersDetails
                              properties={{
                                tenentURL:
                                  this.state.tenentURL +
                                  "/sites/vti_ww_00_9292_spfx/"
                              }}
                            />
                          )}
                        />
                        )
                      </Switch>
                    )}
                  </Grid>
                </Router>
              </Grid>
            </ThemeProvider>
          ) : (
            <div className="conatiner">
              <img
                src="https://wawadev.sharepoint.com/sites/RatnaDev/SiteAssets/shareholders/loading.gif"
                style={{ margin: "auto", display: "block" }}
                className="resposive"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

/// Hello world

// newWeb.currentUser.get().then((r: CurrentUser) => {
//   pnp.sp.profiles.getPropertiesFor(r["LoginName"]).then((profile: any) => {
//     const userProps = profile.UserProfileProperties;
//     const accountEmail = userProps.filter(
//       ({ Key }) => Key === "SPS-ClaimID"
//     );
//     this.setState(
//       {
//         accountEmail: accountEmail[0].Value
//       },
//       () => {
//         newWeb.lists
//           .getByTitle("Shareholding User Details")
//           .items.select("Title", "email", "fullName")
//           .orderBy("Title", true)
//           .filter("email eq '" + this.state.accountEmail + "'")
//           .get()
//           .then(d => {
//             if (d.length > 0) {
//               this.setState(prevState => ({
//                 ...prevState,
//                 accountID: d[0].Title
//               }));
//             }
//           });
//       }
//     );
//   });
// });
