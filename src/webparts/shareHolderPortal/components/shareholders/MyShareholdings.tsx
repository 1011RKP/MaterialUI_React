import {
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import SearchIcon from "@material-ui/icons/Search";
import { Web } from "@pnp/pnpjs";
import * as _ from "lodash";
import * as React from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import { outerTheme, CustomTextField } from "../common/common";
import { MyShareholdingsDetails } from "./MyShareholdingsDetails";
import styles from "./shareholders.module.scss";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";




export class MyShareholdings extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    this.mainHTML = this.mainHTML.bind(this);
    this.state = {
      properties: this.props.properties,
      shareholdingsCollection: [],
      shareholdingsCollection_filter: [],
      shareholdingTitle: "Shareholdings",
      sortShareholderID: "NA", //desc
      sortShares: "NA",
      sortOptions: "NA",
      totalSharesOwned: 0,
      totalOptions:0,
      page: 0,
      rowsPerPage: 3
    };
  }
  public componentDidMount() {
    console.log(this.props);
    let newWeb = new Web(this.state.properties.tenentURL);
    this.getShareholdings(newWeb);
  }

  public getShareholdings = newWeb => {
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
      .filter("shareholderEmail eq '" + this.state.properties.accountEmail + "'")
      .get()
      .then(d => {
        let unique = [];
        unique = _.uniqBy(d, e => {
          return e.shareholderID;
        });
        let totalShares = 0;  let totalOptions = 0;
        this.setState(prevState => ({
          ...prevState,
          shareholdingsCollection: unique,
          shareholdingsCollection_filter: unique
        }));
        for (let index = 0; index < unique.length; index++) {
          totalShares += parseFloat(unique[index].shares.replace(/,/g, ""));
          totalOptions += parseFloat(d[index].options.replace(/,/g, ""));
        }
        let s = (totalShares.toString()).slice(0, ((totalShares.toString()).indexOf("."))+3);
        let o = (totalOptions.toString()).slice(0, ((totalOptions.toString()).indexOf("."))+3);
        this.setState(prevState => ({
          ...prevState,
          totalSharesOwned: Number(s),
          totalOptions:Number(o)
        }));
      });
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

  public handleSearch = e => {
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

  public handleSort = (sortType, column) => {
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
          if (sortType === "asc" || sortType === "NA") {
            var sortCol = this.state.shareholdingsCollection;
            sortCol = _.orderBy(sortCol, column, sortType);
            this.setState({
              shareholdingsCollection: sortCol,
              sortOptions: "desc"
            });
          } else {
            var sortCol = this.state.shareholdingsCollection;
            sortCol = _.orderBy(sortCol, column, sortType);
            this.setState({
              shareholdingsCollection: sortCol,
              sortOptions: "asc"
            });
          }
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

  public mainHTML = () => {
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
                        <br/>
                    </div>
                    <Router>
                      <Table
                        style={{
                          background: "rgb(224, 224, 224)",
                          borderBottom: "2px solid white"
                        }}
                      >
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[
                                5,
                                10,
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
                              <a
                                style={{ cursor: "pointer" }}
                                onClick={e => {
                                  this.handleSort(
                                    this.state.sortOptions,
                                    "options"
                                  );
                                }}
                              >
                                {this.state.sortOptions === "asc" ? (
                                  <ArrowUpwardIcon />
                                ) : null}
                                {this.state.sortOptions === "desc" ? (
                                  <ArrowDownwardIcon />
                                ) : null}
                                Option
                              </a>
                            </TableCell>
                            {/* <TableCell className={styles.tblCell} align="right">
                              Option
                            </TableCell> */}
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
                                  to={`/myShareholdingsDetails/${shareholdings.shareholderID}`}
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
                                  : shareholdings.options
                                      .toString()
                                      .slice(
                                        0,
                                        shareholdings.options
                                          .toString()
                                          .indexOf(".") + 3
                                      )
                                //Math.trunc(shareholdings.options)
                                }
                              </TableCell>
                              <TableCell align="right">
                                {shareholdings.shares
                                  .toString()
                                  .slice(
                                    0,
                                    shareholdings.shares
                                      .toString()
                                      .indexOf(".") + 3
                                  )}
                                {/* {Math.trunc(shareholdings.shares)} */}
                              </TableCell>
                            </TableRow>
                          ))}

                          <TableRow key="001">
                            <TableCell component="th" scope="row" colSpan={2}>
                              Total Shares Owned: {this.state.totalSharesOwned}
                            </TableCell>
                            <TableCell component="th" scope="row" colSpan={2}>
                              Total Options Owned:
                              {this.state.totalOptions}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[
                                5,
                                10,
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
                          path="/myShareholdingsDetails/:accountID"
                          render={props => (
                            <MyShareholdingsDetails
                              properties={{
                                tenentURL: this.state.properties.tenentURL,
                                accountID: this.state.properties.accountID
                              }}
                            />
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
// public mainHTML() {
//   let mainHTML = (
//     <React.Fragment>
//       <div
//         className="row-fluid"
//         style={{ padding: "20px", overflow: "hidden" }}
//       >
//         <div className="row" style={{ paddingTop: "10px" }}>
//           <div className=" col-md-12">
//             <div className="card">
//               <div className={`card-body`}>
//                 <div className={`${styles.cardHead_General} card-header`}>
//                   <h6>Shareholdings</h6>
//                 </div>
//                 <div className="row-fluid" style={{ marginTop: "10px" }}>
//                   <Router>
//                     <Table aria-label="simple table">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>Shareholding Name</TableCell>
//                           <TableCell align="right">Account ID</TableCell>
//                           <TableCell align="right">Shares</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {this.state.shareholdingsCollection.map(
//                           shareholdings => {
//                             return (
//                               <TableRow key={shareholdings.ID}>
//                                 <TableCell component="th" scope="row">
//                                   {shareholdings.Title}
//                                   <br />
//                                   <Link
//                                     style={{
//                                       color: "#dc4848",
//                                       cursor: "pointer",
//                                       padding: "5px;"
//                                     }}
//                                     to={`/myShareholdingsDetails/${shareholdings.accountID}`}
//                                   >
//                                     <SearchIcon fontSize="default" />
//                                     View Details
//                                   </Link>
//                                 </TableCell>
//                                 <TableCell align="right">
//                                   {shareholdings.accountID}
//                                 </TableCell>
//                                 <TableCell align="right">
//                                   {shareholdings.shares}
//                                 </TableCell>
//                               </TableRow>
//                             );
//                           }
//                         )}
//                         <TableRow key="001">
//                           <TableCell component="th" scope="row" colSpan={4}>
//                             Total Shares Owned: 171,656.21
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                     <Switch>
//                       <Route
//                         exact
//                         path="/myShareholdingsDetails/:accountID"
//                         render={props => (
//                           <MyShareholdingsDetails
//                             properties={{
//                               tenentURL: this.state.properties.tenentURL,
//                               accountID: this.state.properties.accountID
//                             }}
//                           />
//                         )}
//                       />
//                     </Switch>
//                   </Router>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//   );
//   return mainHTML;
// }
// public mainHTML() {
//     let mainHTML = (
//       <React.Fragment>
//         {this.state.view_ShareholdersDetails === true ? (
//           <div>
//             <div style={{ backgroundColor: "white" }}>
//               <div
//                 style={{ padding: "15px 0px", borderBottom: "2px solid #eee" }}
//               >
//                 <a
//                   className={styles.viewAllshareholdingsLink}
//                   style={{ color: "#0c69cc", cursor: "pointer" }}
//                   onClick={e => {
//                     this.setState({
//                       view_ShareholdersDetails: !this.state
//                         .view_ShareholdersDetails,
//                       shareholdingTitle: "Shareholdings"
//                     });
//                   }}
//                 >
//                   <KeyboardArrowLeftIcon style={{ fontSize: "2em" }} /> View all
//                   Shareholdings
//                 </a>
//               </div>
//             </div>
//             <ShareholdersDetails AccountID={this.state.AccountID} />
//           </div>
//         ) : (
//           <div
//             className="row-fluid"
//             style={{ padding: "20px", overflow: "hidden" }}
//           >
//             <div className="row" style={{ paddingTop: "10px" }}>
//               <div className=" col-md-12">
//                 <div className="card">
//                   <div className={`card-body`}>
//                     <div className={`${styles.cardHead_General} card-header`}>
//                       <h6>General Information</h6>
//                     </div>
//                     <div className="row-fluid" style={{ marginTop: "10px" }}>
//                       <Table aria-label="simple table">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>Shareholding Name</TableCell>
//                             <TableCell align="right">Account ID</TableCell>
//                             <TableCell align="right">Shares</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           <TableRow key="1">
//                             <TableCell component="th" scope="row">
//                               Wawa, Inc. Employee Stock Ownership Plan Trust
//                               <br />
//                               <a
//                                 style={{ color: "#0c69cc", cursor: "pointer" }}
//                                 onClick={e => {
//                                   this.setState({
//                                     view_ShareholdersDetails: !this.state
//                                       .view_ShareholdersDetails,
//                                     shareholdingTitle:
//                                       "Shareholding Account Details"
//                                   });
//                                 }}
//                               >
//                                 <PageviewIcon fontSize="small" />
//                                 View Details
//                               </a>
//                             </TableCell>
//                             <TableCell align="right">797200</TableCell>
//                             <TableCell align="right">171,656.21</TableCell>
//                           </TableRow>
//                           <TableRow key="001">
//                             <TableCell component="th" scope="row" colSpan={3}>
//                               Total Shares Owned: 171,656.21
//                             </TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </React.Fragment>
//     );
//     return mainHTML;
//   }
//  : // <ShareholdersDetails AccountID={this.state.AccountID} />
