<div className="row">&nbsp;</div>
                      <div className={`row`}>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                          <div className="form-group">
                            <div>
                              <label className="form-check-label">
                                Delaware
                                <br />
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="de_In"
                                  value="In"
                                  checked={this.state.de_In === "In"}
                                  onChange={e =>
                                    this.setState({
                                      formData: { de_In: "In" }
                                    })
                                  }
                                  // onChange={this.de_Change}
                                  //disabled={this.state.de_isDisable}
                                />
                                In
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="de_In"
                                  value="Out"
                                  checked={this.state.de_In === "Out"}
                                  onChange={e =>
                                    this.setState({
                                      formData: { de_In: "Out" }
                                    })
                                  }
                                  //disabled={this.state.de_isDisable}
                                />
                                Out
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                          <div className="form-group">
                            <div>
                              <label className="form-check-label">
                                Florida
                              </label>
                              <br />
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                Not Applicable
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                          <div className="form-group">
                            <div>
                              <label className="form-check-label">
                                Maryland
                              </label>
                              <br />
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="md_In"
                                  value="In"
                                  checked={this.state.md_In === "In"}
                                  // onChange={this.md_Change}
                                  //disabled={this.state.md_isDisable}
                                />
                                In
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="md_In"
                                  value="Out"
                                  checked={this.state.md_In === "Out"}
                                  // onChange={this.md_Change}
                                  //disabled={this.state.md_isDisable}
                                />
                                Out
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                          <div className="form-group">
                            <div>
                              <label className="form-check-label">
                                New Jersey
                              </label>
                              <br />
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="nj_In"
                                  value="In"
                                  checked={this.state.nj_In === "In"}
                                  // onChange={this.nj_Change}
                                  //disabled={this.state.nj_isDisable}
                                />
                                In
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="nj_In"
                                  value="Out"
                                  checked={this.state.nj_In === "Out"}
                                  // onChange={this.nj_Change}
                                  //disabled={this.state.nj_isDisable}
                                />
                                Out
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">&nbsp;</div>
                      <div className={`row`}>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                          <div className="form-group">
                            <div>
                              <label className="form-check-label">
                                Pennsylvania
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="pa_In"
                                  value="In"
                                  checked={this.state.pa_In === "In"}
                                  // onChange={this.pa_Change}
                                  //disabled={this.state.pa_isDisable}
                                />
                                In
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="pa_In"
                                  value="Out"
                                  checked={this.state.pa_In === "Out"}
                                  //onChange={this.pa_Change}
                                  //disabled={this.state.pa_isDisable}
                                />
                                Out
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                          <div className="form-group">
                            <div>
                              <label className="form-check-label">
                                Virginia
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="va_In"
                                  value="In"
                                  checked={this.state.va_In === "In"}
                                  // onChange={this.va_Change}
                                  //disabled={this.state.va_isDisable}
                                />
                                In
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="va_In"
                                  value="Out"
                                  checked={this.state.va_In === "Out"}
                                  // onChange={this.va_Change}
                                  disabled={this.state.va_isDisable}
                                />
                                Out
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                          <div className="form-group">
                            <div>
                              <label className="form-check-label">
                                Federal
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                Not Applicable
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">&nbsp;</div>
                      


                       // case "Maryland":
        //   this.setState({
        //     formData: {
        //       md_In: "Out",
        //       de_disabled: false,
        //       md_disabled: true,
        //       nj_disabled: false,
        //       pa_disabled: false,
        //       va_disabled: false
        //     }
        //   });
        //   break;
        // case "Pennsylvania":
        //   this.setState({
        //     formData: {
        //       pa_In: "Out",
        //       de_disabled: false,
        //       md_disabled: false,
        //       nj_disabled: false,
        //       pa_disabled: true,
        //       va_disabled: false
        //     }
        //   });
        //   break;
        // case "New Jersey":
        //   this.setState({
        //     formData: {
        //       nj_In: "Out",
        //       de_disabled: false,
        //       md_disabled: false,
        //       nj_disabled: true,
        //       pa_disabled: false,
        //       va_disabled: false
        //     }
        //   });
        //   break;
        // case "Virginia":
        //   this.setState({
        //     formData: {
        //       va_In: "Out",
        //       de_disabled: false,
        //       md_disabled: false,
        //       nj_disabled: false,
        //       pa_disabled: false,
        //       va_disabled: true
        //     }
        //   });