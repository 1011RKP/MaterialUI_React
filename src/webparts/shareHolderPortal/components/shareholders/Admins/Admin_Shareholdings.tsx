import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  TextField,
  TableFooter
} from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import SearchIcon from "@material-ui/icons/Search";
import { Web } from "@pnp/sp";
import * as _ from "lodash";
import * as React from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import styles from "../../shareholders/shareholders.module.scss";
import { AdminShareholdersDetails } from "../Admins/Admin_ShareholdersDetails";
import { CustomTextField } from "../../common/common";
// import {  } from "../Admins/Admin_Elections";

export class AdminShareholdings extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.mainHTML = this.mainHTML.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.state = {
      properties: this.props.properties,
      shareholdingsCollection: [],
      shareholdingsCollection_filter: [],
      shareholdingTitle: "Shareholdings",
      sortShareholderID: "NA", //desc
      sortShares: "NA",
      totalSharesOwned: 0,
      page: 0,
      rowsPerPage: 3
    };
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

  public componentDidMount() {
    let newWeb = new Web(this.state.properties.tenentURL);
    this.getShareholdings(newWeb);
  }

  public getShareholdings(newWeb) {
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
        "unvestedOptions"
      )
      .get()
      .then(d => {
        // let unique =d;
        // unique.push(d);
        let unique = [];
        unique = _.uniqBy(d, (e)=> {
          return e.shareholderID;
        });
        let totalShares = 0;
        this.setState(prevState => ({
          ...prevState,
          shareholdingsCollection: unique,
          shareholdingsCollection_filter: unique
        }));
        for (let index = 0; index < unique.length; index++) {
          totalShares += parseFloat(unique[index].shares.replace(/,/g, ""));
        }
        this.setState(prevState => ({
          ...prevState,
          totalSharesOwned: totalShares.toLocaleString()
        }));
      });
  }

  public handleSearch(e) {
    console.log(e.target.value);
    let currentList = [];
    let newList = [];
    let totalShares = 0;
    if (e.target.value !== "") {
      currentList = this.state.shareholdingsCollection_filter;
      newList = currentList.filter(item => {
        const lc = item.shareholderID;
        const filter = e.target.value;
        return lc.includes(filter);
      });
    } else {
      newList = this.state.shareholdingsCollection_filter;
    }
    for (let index = 0; index < newList.length; index++) {
      totalShares += parseFloat(newList[index].shares.replace(/,/g, ""));
      totalSharesOwned: totalShares.toLocaleString();
    }
    this.setState({
      shareholdingsCollection: newList
    });
  }

  public handleSort(sortType, column) {
    let column_Value = column;
    switch (column_Value) {
      case "shareholderID":
        if (sortType === "asc" || sortType === "NA") {
          var shareholdingsCol = this.state.shareholdingsCollection;
          shareholdingsCol = _.orderBy(shareholdingsCol, column, sortType);
          this.setState({
            shareholdingsCollection: shareholdingsCol,
            sortShareholderID: "desc"
          });
        } else {
          var shareholdingsCol = this.state.shareholdingsCollection;
          shareholdingsCol = _.orderBy(shareholdingsCol, column, sortType);
          this.setState({
            shareholdingsCollection: shareholdingsCol,
            sortShareholderID: "asc"
          });
        }
        break;
      case "options":
        break;
      case "shares":
        if (sortType === "asc" || sortType === "NA") {
          var sortCol = this.state.shareholdingsCollection;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShares: "desc"
          });
        } else {
          var sortCol = this.state.shareholdingsCollection;
          sortCol = _.orderBy(sortCol, column, sortType);
          this.setState({
            shareholdingsCollection: sortCol,
            sortShares: "asc"
          });
        }
        break;
    }
  }

  public mainHTML() {
    let mainHTML = (
      <React.Fragment>
        <div
          className="row-fluid"
          style={{ padding: "20px", overflow: "hidden" }}
        >
          <div className="row" style={{ paddingTop: "10px" }}>
            <div className=" col-md-12">
              <div className="card">
                <div className={`card-body`}>
                  <div className={`${styles.cardHead_General} card-header`}>
                    <h6>Shareholdings</h6>
                  </div>
                  <div className="row-fluid" style={{ marginTop: "10px" }}>
                    <div className="row-fluid" style={{ marginBottom: "15px" }}>
                      <FormControl fullWidth>
                        <CustomTextField
                          onChange={this.handleSearch}
                          label="Search by Account ID..."
                        />
                      </FormControl>
                    </div>
                    <Router>
                      <Table style={{ border: "1px solid #e0e0e0" }}>
                        <TableHead style={{ background: "#e0e0e0" }}>
                          <TableRow>
                            <TableCell className={styles.tblCell}>
                              Shareholding Name
                            </TableCell>
                            <TableCell className={styles.tblCell} align="right">
                              <a
                                style={{ cursor: "pointer" }}
                                onClick={e => {
                                  this.handleSort(
                                    this.state.sortShareholderID,
                                    "shareholderID"
                                  );
                                }}
                              >
                                {this.state.sortShareholderID === "asc" ? (
                                  <ArrowUpwardIcon />
                                ) : null}
                                {this.state.sortShareholderID === "desc" ? (
                                  <ArrowDownwardIcon />
                                ) : null}
                                Account ID
                              </a>
                            </TableCell>
                            <TableCell className={styles.tblCell} align="right">
                              Option
                            </TableCell>
                            <TableCell className={styles.tblCell} align="right">
                              <a
                                style={{ cursor: "pointer" }}
                                onClick={e => {
                                  this.handleSort(
                                    this.state.sortShares,
                                    "shares"
                                  );
                                }}
                              >
                                {this.state.sortShares === "asc" ? (
                                  <ArrowUpwardIcon />
                                ) : null}
                                {this.state.sortShares === "desc" ? (
                                  <ArrowDownwardIcon />
                                ) : null}
                                Shares
                              </a>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(this.state.rowsPerPage > 0
                            ? this.state.shareholdingsCollection.slice(
                                this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage +
                                  this.state.rowsPerPage
                              )
                            : this.state.shareholdingsCollection
                          ).map(shareholdings => (
                            <TableRow key={shareholdings.ID}>
                              <TableCell component="th" scope="row">
                                {shareholdings.Title}
                                <br />
                                <Link
                                  style={{
                                    color: "#dc4848",
                                    cursor: "pointer",
                                    padding: "5px;"
                                  }}
                                  to={`/adminShareholdersDetails/${shareholdings.shareholderID}`}
                                >
                                  <SearchIcon fontSize="default" />
                                  View Details
                                </Link>
                              </TableCell>
                              <TableCell align="right">
                                {shareholdings.shareholderID}
                              </TableCell>
                              <TableCell align="right">
                                {shareholdings.options === 0
                                  ? "-"
                                  : Math.trunc(shareholdings.options)}
                              </TableCell>
                              <TableCell align="right">
                                {Math.trunc(shareholdings.shares)}
                              </TableCell>
                            </TableRow>
                          ))}

                          <TableRow key="001">
                            <TableCell component="th" scope="row" colSpan={4}>
                              Total Shares Owned: {this.state.totalSharesOwned}
                            </TableCell>
                          </TableRow>
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
                              colSpan={4}
                              count={this.state.shareholdingsCollection.length}
                              rowsPerPage={this.state.rowsPerPage}
                              page={this.state.page}
                              onChangePage={this.handleChangePage}
                              onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                      <Switch>
                        <Route
                          exact
                          path={`/adminShareholdersDetails/:shareholderID}`}
                          render={props => (
                            <AdminShareholdersDetails {...props} />
                          )}
                        />
                      </Switch>
                    </Router>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return mainHTML;
  }

  public render(): React.ReactElement<any> {
    const mainHTML = this.mainHTML();
    return (
      <React.Fragment>
        <div className={styles.shareholders}>
          <div className={styles.contentHead}>
            <h2>{this.state.shareholdingTitle}</h2>
          </div>
          {mainHTML}
        </div>
      </React.Fragment>
    );
  }
}