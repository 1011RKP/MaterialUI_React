import { AppBar, Button, Select, MenuItem } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Web } from "@pnp/sp";
import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "../common/common";
import styles from "./AdminReportsHome.module.scss";
import { ReportsShareholdingAccountInformation } from "./Reports_ShareholdingAccountInformation";
import { ReportsShareholdingElections } from "./Reports_ShareholdingElections";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
SPComponentLoader.loadCss(
  "https://wawadev.sharepoint.com/sites/RatnaDev/SiteAssets/ShareHolders/font-awesome.min"
);

export class AdminReportsHome extends React.Component<any, any> {
  public constructor(props: any, state: any) {
    super(props);
    //this.getAccountInfo = this.getAccountInfo.bind(this);
    //this.getTaxyears = this.getTaxyears.bind(this);
    //this.a11yProps = this.a11yProps.bind(this);
    // this.tab_handleChange = this.tab_handleChange.bind(this);
    // this.tab_handleChangeIndex = this.tab_handleChangeIndex.bind(this);
    this.state = {
      value: 0,
      setValue: 0,
      properties: this.props.properties,
      tenentURL: this.props.properties.tenentURL,
      accountInfoCollforTable: [],
      accountInfoCollforExcel: [],
      electionColl: [],
      Is_AccountInfo: false,
      Is_ElectionInfo: false,
      years_DD: [],
      ele_taxYear: Number(new Date().getFullYear())
    };
  }

  public getTaxyears = () => {
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

  public componentDidMount(){
    this.getTaxyears();
    console.log(this.state.properties);
    if (this.state.tenentURL !== undefined) {
      this.getAccountInfo();
      this.getElectionInfo();
    }
  }

  public getAccountInfo = () => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Account Information")
      .items.select(
        "Title",
        "ShareholdingName",
        "giPrimeShareholderContact",
        "saAddressLine1",
        "saAddressLine2",
        "saCity",
        "saState",
        "saZip",
        "saPriorityMailingMethod",
        "dmaDocumentMailingAddress",
        "dmaAddressLine1",
        "dmaAddressLine2",
        "dmaCity",
        "dmaState",
        "dmaZip",
        "dmaPriorityMailingMethod",
        "ID"
      )
      .getAll(5000)
      .then(i => {
        let excle = [];
        let tbl = [];
        for (let index = 0; index < i.length; index++) {
          let excle1 = {
            AccountNumber: i[index].Title,
            Name: i[index].ShareholdingName,
            PrimaryContact: i[index].giPrimeShareholderContact,
            MailingAddressLine1: i[index].saAddressLine1,
            MailingAddressLine2: i[index].saAddressLine2,
            MailingCity: i[index].saCity,
            MailingState: i[index].saState,
            MailingZip: i[index].saZip,
            PriorityMailingMethod: i[index].saPriorityMailingMethod,
            MailingLabelAddressee1: i[index].dmaDocumentMailingAddress,
            DocumentMailingAddressLine1: i[index].dmaAddressLine1,
            DocumentMailingAddressLine2: i[index].dmaAddressLine2,
            DocumentMailingCity: i[index].dmaCity,
            DocumentMailingState: i[index].dmaState,
            DocumentMailingZip: i[index].dmaZip,
            DocumentPriorityMailingMethod: i[index].dmaPriorityMailingMethod
          };
          excle.push(excle1);
          let tbl1 = {
            AccountNumber: i[index].Title,
            Name: i[index].ShareholdingName,
            PrimaryContact: i[index].giPrimeShareholderContact,
            MailingAddressLine1: i[index].saAddressLine1,
            MailingAddressLine2: i[index].saAddressLine2,
            MailingCity: i[index].saCity,
            MailingState: i[index].saState,
            MailingZip: i[index].saZip,
            PriorityMailingMethod: i[index].saPriorityMailingMethod,
            DocumentPriorityMailingMethod: i[index].dmaPriorityMailingMethod
          };
          tbl.push(tbl1);
        }
        this.setState({
          accountInfoCollforExcel: excle,
          accountInfoCollforTable: tbl
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  public getElectionInfo = () => {
    let newWeb = new Web(this.state.tenentURL);
    newWeb.lists
      .getByTitle("Shareholding Elections")
      .items.select(
        "Title",
        "TaxYear",
        "StateforStateTaxes",
        "Delaware",
        "Maryland",
        "NewJersey",
        "Pennsylvania",
        "Virginia",
        "ID"
      )
      .getAll(5000)
      .then(i => {
        let excle = [];
        for (let index = 0; index < i.length; index++) {
          let excle1 = {
            AccountNumber: i[index].Title,
            TaxYear: i[index].TaxYear,
            ResidentState: i[index].StateforStateTaxes,
            Delaware: i[index].Delaware,
            Maryland: i[index].Maryland,
            NewJersey: i[index].NewJersey,
            Pennsylvania: i[index].Pennsylvania,
            Virginia: i[index].Virginia,
            Florida: i[index].Florida
          };
          excle.push(excle1);
        }
        this.setState({
          electionColl: excle
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.AdminReportsHome}>
        <div className={styles.contentHead}>
          <h2>Shareholder Reports</h2>
        </div>
        <div className="row-fluid">
          <div className="row">
            <div className="col-md-12">
              <AppBar position="static">
                <Tabs
                  value={this.state.value}
                  onChange={this.tab_handleChange}
                  className={styles.tabsStyles}
                >
                  <Tab label="Address Information" {...this.a11yProps(0)} />
                  <Tab
                    label="Composite Elections by Year"
                    {...this.a11yProps(1)}
                  />
                </Tabs>
              </AppBar>
              <SwipeableViews
                index={this.state.value}
                onChangeIndex={this.tab_handleChangeIndex}
              >
                <TabPanel value={this.state.value} index={0}>
                  <div className="container">
                    <br />
                    <div className="alert alert-dark">
                      <strong>Reports!</strong>This Report displays Shareholding
                      Addresses
                    </div>
                    <div
                      className="alert"
                      style={{ padding: "0px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={e => {
                          this.setState({
                            Is_AccountInfo: true,
                            Is_ElectionInfo: false
                          });
                        }}
                      >
                        <FontAwesomeIcon
                          style={{ marginRight: "3px" }}
                          icon={faFileExcel}
                        />{" "}
                        Generate Reports
                      </Button>
                      <br />
                    </div>
                    <div className="row-fluid">
                      {this.state.Is_AccountInfo !== false ? (
                        <ReportsShareholdingAccountInformation
                          data={{
                            accountInfoCollforExcel: this.state
                              .accountInfoCollforExcel,
                            accountInfoCollforTable: this.state
                              .accountInfoCollforTable
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                  <div className="container">
                    <br />
                    <div className="alert alert-dark">
                      <strong>Reports!</strong>This Report displays Composite
                      Election by Year{"  "}
                      <Select
                        name="ele_taxYear"
                        value={this.state.ele_taxYear}
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
                    </div>
                    <div
                      className="alert"
                      style={{ padding: "0px", float: "right" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={e => {
                          this.setState({
                            Is_AccountInfo: false,
                            Is_ElectionInfo: true
                          });
                        }}
                      >
                        <FontAwesomeIcon
                          style={{ marginRight: "3px" }}
                          icon={faFileExcel}
                        />{" "}
                        Generate Reports
                      </Button>
                      <br />
                    </div>
                    <div className="row-fluid">
                      {this.state.Is_ElectionInfo !== false ? (
                        <ReportsShareholdingElections
                          data={{
                            electionColl: this.state.electionColl
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </TabPanel>
              </SwipeableViews>

              <div className="col-md-12">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
