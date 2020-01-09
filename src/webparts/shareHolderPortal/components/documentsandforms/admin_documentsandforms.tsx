import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  TableFooter,
  FormControl
} from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { TabPanel } from "../common/common";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import FolderIcon from "@material-ui/icons/Folder";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import { Web } from "@pnp/sp";
import * as React from "react";
import DataTable from "react-data-table-component";
import Moment from "react-moment";
import SwipeableViews from "react-swipeable-views";
import styles from "./documentsandforms.module.scss";
import * as _ from "lodash";
import { CustomTextField } from "../common/common";

export class AdmindocumentsandForms extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.tab_handleChange = this.tab_handleChange.bind(this);
    this.tab_handleChangeIndex = this.tab_handleChangeIndex.bind(this);
    this.a11yProps = this.a11yProps.bind(this);
    this.getCommunityDividends = this.getCommunityDividends.bind(this);
    this.getCommunityDocuments = this.getCommunityDocuments.bind(this);
    this.getCommunityFinancialInformation = this.getCommunityFinancialInformation.bind(
      this
    );
    this.handleSearch = this.handleSearch.bind(this);
    this.getCommunityForms = this.getCommunityForms.bind(this);
    this.getCommunityTaxNotices = this.getCommunityTaxNotices.bind(this);
    this.shareholdersHTML = this.shareholdersHTML.bind(this);
    this.getAllShareHolders = this.getAllShareHolders.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.communityDocumentsHTML = this.communityDocumentsHTML.bind(this);
    this.state = {
      properties: this.props.properties,
      shareHoldingDocCollection: [],
      shareHoldingDocisNotAvilable: false,
      communitySelected: 0,
      communityContent: false,
      communityDocumentsCollection: [],
      communityDocuments_IsOpen: false,
      communityDocuments_IsSelected: false,
      communityFinancialInformationCollection: [],
      communityFinancialInformation_IsOpen: false,
      communityFinancialInformation_IsSelected: false,
      communityFormsCollection: [],
      communityForms_IsOpen: false,
      communityForms_IsSelected: false,
      communityDividendscollection: [],
      communityDividends_IsOpen: false,
      communityDividends_IsSelected: false,
      communityTaxNoticesCollection: [],
      communityTaxNotices_IsOpen: false,
      communityTaxNotices_IsSelected: false,
      tenentURL: this.props.properties.tenentURL,
      allShareHoldersAccounts: [],
      allShareHoldersAccounts_fliter: [],
      open: false,
      value: 0,
      setValue: 0,
      loadPage: false,
      sortOrder: false,
      page: 0,
      rowsPerPage: 10
    };
  }

  public handleSort() {
    let data = this.state.allShareHoldersAccounts;
    if (this.state.sortOrder !== true) {
      data.sort((a, b) => Number(b.shareholderID) - Number(a.shareholderID));
      this.setState({
        allShareHoldersAccounts: data,
        sortOrder: !this.state.sortOrder
      });
    } else {
      data.sort((a, b) => Number(a.shareholderID) - Number(b.shareholderID));
      this.setState({
        allShareHoldersAccounts: data,
        sortOrder: !this.state.sortOrder
      });
    }
  }

  public handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    this.setState({
      page: newPage
    });
  }

  public handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value)
    });
  }

  public handleSearch(e) {
    console.log(e.target.value);
    let currentList = [];
    let newList = [];
    if (e.target.value !== "") {
      currentList = this.state.allShareHoldersAccounts_fliter;
      newList = currentList.filter(item => {
        const lc = item.shareholderID; //.toLowerCase();
        const filter = e.target.value; //.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      newList = this.state.allShareHoldersAccounts_fliter;
    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      allShareHoldersAccounts: newList
    });
  }

  public getOnDemandShareHoldingDocs(id) {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Documents")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "AccountID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      .filter("AccountID eq '" + id + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            shareHoldingDocCollection: d,
            //shareHoldingDocCollection_filter: d,
            shareHoldingDocisNotAvilable: false
          });
        } else {
          this.setState({
            shareHoldingDocCollection: [],
            //shareHoldingDocCollection_filter: d,
            shareHoldingDocisNotAvilable: true
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public componentDidMount() {
    this.setState(
      {
        tenentURL: this.state.tenentURL + "/sites/vti_ww_00_9292_spfx/"
      },
      () => {
        this.getAllShareHolders();
        this.getCommunityDividends();
        this.getCommunityDocuments();
        this.getCommunityFinancialInformation();
        this.getCommunityForms();
        this.getCommunityTaxNotices();
      }
    );
  }

  public getCommunityDividends() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Dividends")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityDividendscollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getCommunityDocuments() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Documents")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityDocumentsCollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getCommunityFinancialInformation() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Financial Information")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityFinancialInformationCollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getCommunityForms() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Forms")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityFormsCollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public getCommunityTaxNotices() {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Community Tax Notices")
      .items.select(
        "Title",
        "BaseName",
        "EncodedAbsUrl",
        "ID",
        "Modified",
        "Created"
      )
      .orderBy("Title", true)
      //.filter("AccountID eq '" + this.state.properties.accountID + "'")
      .get()
      .then(d => {
        if (d.length > 0) {
          this.setState({
            communityTaxNoticesCollection: d
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  public tab_handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    this.setState({
      setValue: newValue,
      value: newValue
    });
    console.log(this.state);
  }

  public tab_handleChangeIndex = (index: number) => {
    this.setState({
      setValue: index,
      value: index
    });
  }

  public a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  public getAllShareHolders(): any {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholdings")
      .items.select("shareholderID", "ID")
      .orderBy("ID", true)
      .get()
      .then(d => {
        let unique = _.uniqBy(d, (e) => {
          return e.shareholderID;
        });
        this.setState({
          allShareHoldersAccounts: unique,
          allShareHoldersAccounts_fliter: unique,
          loadPage: true
        });
        console.log(this.state.allShareHoldersAccounts);
      })
      .catch(e => {
        console.error(e);
      });
  }

  public shareholdersHTML() {
    let shareholderHTML = (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-5 col-sm-6 col-xs-6">
            <Paper>
              <FormControl fullWidth>
                <CustomTextField
                  onChange={this.handleSearch}
                  label="Search by Account ID..."
                />
              </FormControl>
              <Table aria-label="simple table" style={{ marginTop: "10px" }}>
                <TableHead style={{ backgroundColor: "#976340" }}>
                  <TableRow>
                    <TableCell>
                      <a
                        className={styles.tblHeadSortLink}
                        onClick={this.handleSort}
                        style={{ cursor: "pointer" }}
                      >
                        {this.state.sortOrder === true ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )}{" "}
                        AccountID
                      </a>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(this.state.rowsPerPage > 0
                    ? this.state.allShareHoldersAccounts.slice(
                        this.state.page * this.state.rowsPerPage,
                        this.state.page * this.state.rowsPerPage +
                          this.state.rowsPerPage
                      )
                    : this.state.allShareHoldersAccounts
                  ).map(row => (
                    <TableRow key={row.ID}>
                      <TableCell component="th" scope="doc">
                        <a
                          style={{ cursor: "pointer" }}
                          className={styles.accountIDLink}
                          onClick={() => {
                            this.getOnDemandShareHoldingDocs(row.shareholderID);
                          }}
                        >
                          <FolderIcon /> {row.shareholderID}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 }
                      ]}
                      colSpan={1}
                      count={this.state.allShareHoldersAccounts.length}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      // SelectProps={{
                      //   inputProps: { "aria-label": "rows per page" },
                      //   native: true
                      // }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Paper>
          </div>
          <div className="col-lg-8 col-md-7 col-sm-6 col-xs-6">
            {this.state.shareHoldingDocCollection.length > 0 ? (
              <Paper>
                <div style={{ padding: "10px", background: "#eeeeee" }}>
                  <h4>
                    ShareHolding Documents with Account ID{" "}
                    {this.state.shareHoldingDocCollection[0].AccountID}
                  </h4>
                </div>
                <div style={{ padding: "10px" }}>
                  <React.Fragment>
                    <Table aria-label="simple table">
                      <TableHead style={{ backgroundColor: "#ff9800" }}>
                        <TableRow>
                          <TableCell style={{ color: "white" }}>
                            Title
                          </TableCell>
                          <TableCell align="right" style={{ color: "white" }}>
                            Created
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.shareHoldingDocCollection.map(doc => (
                          <TableRow key={doc.ID}>
                            <TableCell component="th" scope="doc">
                              <a
                                className={styles.docLink}
                                target="_blank"
                                href={doc.EncodedAbsUrl}
                              >
                                <PictureAsPdfIcon className={styles.docPDF} />
                                {doc.BaseName}
                              </a>
                            </TableCell>
                            <TableCell align="right">
                              <Moment format="MMMM, Do, YYYY">
                                {doc.Created}
                              </Moment>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </React.Fragment>
                </div>
              </Paper>
            ) : null}
            <div style={{ padding: "10px" }}>
              {this.state.shareHoldingDocisNotAvilable !== false ? (
                <React.Fragment>
                  <div className="alert alert-danger">
                    <h5 style={{ fontSize: "16px" }}>
                      No Documents found on the given account Number{" "}
                      {/* {this.state.properties.accountID} */}
                    </h5>
                  </div>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return shareholderHTML;
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.documentsandforms}>
        <div className={styles.contentHead}>
          <h2>Documents and Forms</h2>
        </div>
        <div>
          <AppBar position="static">
            <Tabs
              value={this.state.value}
              onChange={this.tab_handleChange}
              className={styles.tabsStyles}
            >
              <Tab label="Shareholding Documents" {...this.a11yProps(0)} />
              <Tab label="Community Documents" {...this.a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            index={this.state.value}
            onChangeIndex={this.tab_handleChangeIndex}
          >
            <TabPanel value={this.state.value} index={0}>
              <div style={{ padding: "20px", overflow: "hidden" }}>
                {this.state.loadPage !== false ? this.shareholdersHTML() : null}
              </div>
            </TabPanel>
            <TabPanel value={this.state.value} index={1}>
              {this.state.loadPage !== false
                ? this.communityDocumentsHTML()
                : null}
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
    );
  }

  public communityDocumentsHTML() {
    let communityDocumentsHTML = (
      <div
        className="row-fluid"
        style={{ paddingTop: "10px", overflow: "hidden" }}
      >
        <div className="row">
          <div className="col-md-12">
            <Divider />
            <List component="nav">
              <ListItem
                button
                selected={this.state.communitySelected === 2}
                onClick={event => {
                  this.setState({
                    communityContent: !this.state.communityContent,
                    communitySelected: 2
                  });
                }}
              >
                <ListItemIcon>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Community Documents Folder" />
              </ListItem>
            </List>
            {this.state.communityContent !== false ? (
              <React.Fragment>
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={this.state.communityTaxNotices_IsSelected}
                    onClick={event => {
                      this.setState({
                        communityTaxNotices_IsOpen: !this.state
                          .communityTaxNotices_IsOpen,
                        communityTaxNotices_IsSelected: !this.state
                          .communityTaxNotices_IsSelected,
                        communityForms_IsSelected: false,
                        communityForms_IsOpen: false,
                        communityFinancialInformation_IsOpen: false,
                        communityFinancialInformation_IsSelected: false,
                        communityDividends_IsSelected: false,
                        communityDividends_IsOpen: false,
                        communityDocuments_IsSelected: false,
                        communityDocuments_IsOpen: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Tax Notice" />
                  </ListItem>
                </List>
                {this.state.communityTaxNotices_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                            style={{
                              backgroundColor: "#976340",
                              color: "white"
                            }}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityTaxNoticesCollection.map(
                              doc => (
                                <TableRow key={doc.ID}>
                                  <TableCell component="th" scope="doc">
                                    <a
                                      className={styles.docLink}
                                      target="_blank"
                                      href={doc.EncodedAbsUrl}
                                    >
                                      <PictureAsPdfIcon
                                        className={styles.docPDF}
                                      />
                                      {doc.BaseName}
                                    </a>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Moment format="MMMM, Do, YYYY">
                                      {doc.Created}
                                    </Moment>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={this.state.communityForms_IsSelected}
                    onClick={event => {
                      this.setState({
                        communityForms_IsSelected: !this.state
                          .communityForms_IsSelected,
                        communityForms_IsOpen: !this.state
                          .communityForms_IsOpen,
                        communityTaxNotices_IsOpen: false,
                        communityTaxNotices_IsSelected: false,
                        communityFinancialInformation_IsOpen: false,
                        communityFinancialInformation_IsSelected: false,
                        communityDividends_IsSelected: false,
                        communityDividends_IsOpen: false,
                        communityDocuments_IsSelected: false,
                        communityDocuments_IsOpen: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Forms" />
                  </ListItem>
                </List>
                {this.state.communityForms_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                            style={{
                              backgroundColor: "#976340",
                              color: "white"
                            }}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityFormsCollection.map(doc => (
                              <TableRow key={doc.ID}>
                                <TableCell component="th" scope="doc">
                                  <a
                                    className={styles.docLink}
                                    target="_blank"
                                    href={doc.EncodedAbsUrl}
                                  >
                                    <PictureAsPdfIcon
                                      className={styles.docPDF}
                                    />
                                    {doc.BaseName}
                                  </a>
                                </TableCell>
                                <TableCell align="right">
                                  <Moment format="MMMM, Do, YYYY">
                                    {doc.Created}
                                  </Moment>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={
                      this.state.communityFinancialInformation_IsSelected
                    }
                    onClick={event => {
                      this.setState({
                        communityFinancialInformation_IsOpen: !this.state
                          .communityFinancialInformation_IsOpen,
                        communityFinancialInformation_IsSelected: !this.state
                          .communityFinancialInformation_IsSelected,
                        communityForms_IsSelected: false,
                        communityForms_IsOpen: false,
                        communityTaxNotices_IsOpen: false,
                        communityTaxNotices_IsSelected: false,
                        communityDividends_IsSelected: false,
                        communityDividends_IsOpen: false,
                        communityDocuments_IsSelected: false,
                        communityDocuments_IsOpen: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Financial Information" />
                  </ListItem>
                </List>
                {this.state.communityFinancialInformation_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                            style={{
                              backgroundColor: "#976340",
                              color: "white"
                            }}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityFormsCollection.map(doc => (
                              <TableRow key={doc.ID}>
                                <TableCell component="th" scope="doc">
                                  <a
                                    className={styles.docLink}
                                    target="_blank"
                                    href={doc.EncodedAbsUrl}
                                  >
                                    <PictureAsPdfIcon
                                      className={styles.docPDF}
                                    />
                                    {doc.BaseName}
                                  </a>
                                </TableCell>
                                <TableCell align="right">
                                  <Moment format="MMMM, Do, YYYY">
                                    {doc.Created}
                                  </Moment>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={this.state.communityDividends_IsSelected}
                    onClick={event => {
                      this.setState({
                        communityDividends_IsSelected: !this.state
                          .communityDividends_IsSelected,
                        communityDividends_IsOpen: !this.state
                          .communityDividends_IsOpen,
                        communityFinancialInformation_IsOpen: false,
                        communityFinancialInformation_IsSelected: false,
                        communityForms_IsSelected: false,
                        communityForms_IsOpen: false,
                        communityTaxNotices_IsOpen: false,
                        communityTaxNotices_IsSelected: false,
                        communityDocuments_IsSelected: false,
                        communityDocuments_IsOpen: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Dividends" />
                  </ListItem>
                </List>
                {this.state.communityDividends_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                            style={{
                              backgroundColor: "#976340",
                              color: "white"
                            }}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityDividendscollection.map(
                              doc => (
                                <TableRow key={doc.ID}>
                                  <TableCell component="th" scope="doc">
                                    <a
                                      className={styles.docLink}
                                      target="_blank"
                                      href={doc.EncodedAbsUrl}
                                    >
                                      <PictureAsPdfIcon
                                        className={styles.docPDF}
                                      />
                                      {doc.BaseName}
                                    </a>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Moment format="MMMM, Do, YYYY">
                                      {doc.Created}
                                    </Moment>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
                <List style={{ marginLeft: "25px" }} component="nav">
                  <ListItem
                    button
                    selected={this.state.communityDocuments_IsSelected}
                    onClick={event => {
                      this.setState({
                        communityDocuments_IsSelected: !this.state
                          .communityDocuments_IsSelected,
                        communityDocuments_IsOpen: !this.state
                          .communityDocuments_IsOpen,
                        communityDividends_IsSelected: false,
                        communityDividends_IsOpen: false,
                        communityFinancialInformation_IsOpen: false,
                        communityFinancialInformation_IsSelected: false,
                        communityForms_IsSelected: false,
                        communityForms_IsOpen: false,
                        communityTaxNotices_IsOpen: false,
                        communityTaxNotices_IsSelected: false
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="Community Documents" />
                  </ListItem>
                </List>
                {this.state.communityDocuments_IsOpen !== false ? (
                  <React.Fragment>
                    <Divider />
                    <div
                      style={{
                        marginLeft: "50px",
                        marginBottom: "10px",
                        marginTop: "10px"
                      }}
                    >
                      <Paper>
                        <Table aria-label="simple table">
                          <TableHead
                            style={{
                              backgroundColor: "#976340",
                              color: "white"
                            }}
                          >
                            <TableRow>
                              <TableCell className={styles.tblHeadCell}>
                                Name
                              </TableCell>
                              <TableCell
                                className={styles.tblHeadCell}
                                align="right"
                              >
                                Last Modified
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.communityDocumentsCollection.map(
                              doc => (
                                <TableRow key={doc.ID}>
                                  <TableCell component="th" scope="doc">
                                    <a
                                      className={styles.docLink}
                                      target="_blank"
                                      href={doc.EncodedAbsUrl}
                                    >
                                      <PictureAsPdfIcon
                                        className={styles.docPDF}
                                      />
                                      {doc.BaseName}
                                    </a>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Moment format="MMMM, Do, YYYY">
                                      {doc.Created}
                                    </Moment>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Paper>
                    </div>
                  </React.Fragment>
                ) : null}
                <Divider />
              </React.Fragment>
            ) : null}
            <Divider />
          </div>
        </div>
      </div>
    );
    return communityDocumentsHTML;
  }
}
