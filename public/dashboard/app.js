
var sidenNaveElement = document.getElementById('side-nav');
var mainElement = document.getElementById('ultimateMainContainer');
var nameElement = document.getElementById('username');
var name = "Momoland Nancy";
const contest = "Contest";
const dashboard = "Dashboard";
const announcements = "Announcements";
var datafeather = "data-feather";
var eventsRef = firebase.database().ref("event");
const refCandidates = "candidates";
const refCriteria = "criteria";
const refJudge = "judges";
const refAnnouncements = "announcements";

function renderTabulation() {

  ReactDOM.render(
    <div>
      <SideNav ficon="grid" cname="sideNav-menus-font nav-link" lname={dashboard} eventc={(e) => renderDashboard()} />
      <SideNav ficon="layers" cname="sideNav-menus-font nav-link custom-active" lname={contest} />
    </div>
    , sidenNaveElement);
    ReactDOM.render(<MainTabulation />, mainElement);
}

// function renderAnnouncements() {
//   ReactDOM.render(<MainAnnouncement />, mainElement);
//   ReactDOM.render(
//     <div>
//       <SideNav ficon="grid" cname="nav-link" lname={dashboard} eventc={(e) => renderDashboard()} />
//       <SideNav ficon="grid" cname="nav-link " lname={contest} eventc={(e) => renderTabulation()} />
//       <SideNav ficon="circle" cname="nav-link custom-active" lname={announcements} eventc={(e) => renderAnnouncements()} />
//     </div>
//     , sidenNaveElement);
// }


function Nameclass() {
  return (
    <div className="username">{name}</div>
  );
}

class SideNav extends React.Component {
  render() {
    return (
      <div>
        <a className={this.props.cname} onClick={this.props.eventc}><i className="align-middle" data-feather={this.props.ficon}></i>{this.props.lname}</a>
      </div>
    );
  }
}
//---------------------------------------------start Tabulation ----------------------------------------------------

class MainTabulation extends React.Component {
  componentDidMount() {
    getEvents();
  }
  render() {
    return (

      <div className="pl-3 pr-3 pt-5 w-100">
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
          Add Event
            </button>
        <div id="eventscontainer" className="row w-100 mt-3">

        </div>
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Add Event</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">

                <div className="row pl-3 pr-3">
                  <div className="col-sm-12">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Event Name</span>
                      </div>
                      <input id="eventname" type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={(e) => writeEventName()} >Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>


    );
  }
}
// ----------------------------------------Candidates--------------------------------------------------------
class Candidates extends React.Component {
  delCandidate() {
    deleteCandidate(this.props.eventid, this.props.contestantid);
    getCandidates(this.props.eventid);
    $("#candidateconfirmdelete" + this.props.contestantid).modal('hide');
  }
  updateCandidate() {
    var UpdatedContestantName = $("#contestant-name" + this.props.contestantid).val();
    var updatedContestantDescription = $("#contestant-description" + this.props.contestantid).val()
    console.log("update test: " + UpdatedContestantName + " " + updatedContestantDescription);
    updateCandidate(this.props.eventid, this.props.contestantid, UpdatedContestantName, updatedContestantDescription);
    getCandidates(this.props.eventid);
    $("#updateContestant" + this.props.contestantid).modal('hide');
  }
  componentDidMount() {
    feather.replace();

  }

  render() {
    return (
      <div className="list-group-item flex-column align-items-start">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">{this.props.candidatename}</h5>
          {/* <small>3 days ago</small> */}
          <div className="row">
            <i className="mb-1 ml-3 align-middle" data-toggle="modal" data-target={"#updateContestant" + this.props.contestantid} data-feather="edit-3"></i>
            <i className="mb-1 ml-2 align-middle text-danger" data-toggle="modal" data-target={"#candidateconfirmdelete" + this.props.contestantid} data-feather="trash-2"></i>

          </div>

        </div>
        <p className="mb-1 text-info">{this.props.candidatedescription}</p>
        {/* <small>Donec id elit non mi porta.</small> */}
        {/* confirm Candidate Delete */}
        <div className="modal fade" id={"candidateconfirmdelete" + this.props.contestantid} tabIndex="" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Confirm Delete</h5>
              </div>
              <div className="modal-body ">
                <p className="flow-text">Are You Sure To Delete This?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.delCandidate.bind(this)} >Delete</button>
              </div>
            </div>
          </div>
        </div>
        {/* end Of confirm delete modal */}

        {/* update Contestant modal */}
        <div className="modal fade" id={"updateContestant" + this.props.contestantid} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Contestant</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <div className="row pl-3 pr-3">
                  <div className="col-sm-12">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Contestant Name</span>
                      </div>
                      <input id={"contestant-name" + this.props.contestantid} type="text" defaultValue={this.props.candidatename} className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Description</span>
                      </div>
                      <textarea id={"contestant-description" + this.props.contestantid} defaultValue={this.props.candidatedescription} className="form-control" aria-label="With textarea"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.updateCandidate.bind(this)} >Save changes</button>
              </div>
            </div>
          </div>
        </div>
        {/*End update Contestant modal */}
      </div>
    )
  }
}

class Results extends React.Component {

  componentDidMount() {
    feather.replace();
    var resultContainer = document.getElementById("result"+this.props.contestantid);
    var candidateObjects = 0;
    var candidateNumber = 0;
    firebase.database().ref("resultTotal").child("event"+this.props.eventid).child("contestant"+this.props.contestantid).once('value', function (snapshot) {
      snapshot.forEach(function (childsnapshot) {
        candidateObjects = candidateObjects+childsnapshot.val().totalRating;
        candidateNumber++;
      });
      if (candidateNumber!=0){
        ReactDOM.render(
          <div>
            {Math.round((candidateObjects/candidateNumber)*100)/100}
           </div>
           , resultContainer
         );

      }


    });

  }

  render() {
    return (
      <div className="list-group-item flex-column align-items-start">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">{this.props.candidatename}</h5>
          {/* <small>3 days ago</small> */}
          <div id={"result"+this.props.contestantid} className="row">


          </div>

        </div>
        <p className="mb-1 text-info">{this.props.candidatedescription}</p>
        {/* <small>Donec id elit non mi porta.</small> */}
        {/* confirm Candidate Delete */}

        {/* end Of confirm delete modal */}

        {/* update Contestant modal */}

        {/*End update Contestant modal */}
      </div>
    )
  }
}

// **************************************************** End Candidates ********************************************************




// ------------------------------------------------------ Judge --------------------------------------------------------
class Judge extends React.Component {
  delJudge() {
    firebase.database().ref().child(refJudge).child(this.props.judgeEventId).child(this.props.judgeId).remove();
    $("#confimrDeleteJudge" + this.props.judgeId).modal('hide');
    getJudge(this.props.judgeEventId);
    firebase.database().ref().child("routeJudges").child(this.props.judgeId).remove();

  }
  copyAccessCode() {
    var copyText = document.getElementById("access-code-field" + this.props.judgeId);
    copyText.select();
    document.execCommand("copy");
    alert("Access Code Copied " + copyText.value);
  }
  updateJudge() {
    var updatedJudgeName = $("#judge-name" + this.props.judgeId).val();
    var updatedJudgeDescription = $("#judge-description" + this.props.judgeId).val();
    firebase.database().ref().child(refJudge).child(this.props.judgeEventId).child(this.props.judgeId).update({
      judgeName: updatedJudgeName,
      judgeDescription: updatedJudgeDescription
    });
    firebase.database().ref().child("routeJudges").child(this.props.judgeId).update({
      judgeName: updatedJudgeName,
      judgeDescription: updatedJudgeDescription
    });
    getJudge(this.props.judgeEventId);
    $("#updateJudge" + this.props.judgeId).modal('hide');
  }
  componentDidMount() {
    feather.replace();
  }
  render() {
    return (
      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div href="" >
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1" data-toggle="modal" data-target={"#detailsJudgeModal" + this.props.judgeId}>{this.props.judgeName}</h5>
            {/* <small>3 days ago</small> */}
            <div className="row">
              <i className="mb-1 ml-3 align-middle" data-toggle="modal" data-target={"#updateJudge" + this.props.judgeId} data-feather="edit-3"></i>
              <i className="mb-1 ml-2 align-middle text-danger" data-toggle="modal" data-target={"#confimrDeleteJudge" + this.props.judgeId} data-feather="trash-2"></i>
            </div>

          </div>
          <p className="mb-1 text-info">{this.props.judgeDescription}</p>
          {/* <small>Donec id elit non mi porta.</small> */}

        </div>
        {/* modals */}
        {/* confirm judge delete modal */}
        <div className="modal fade" id={"confimrDeleteJudge" + this.props.judgeId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Confirm Delete</h5>
              </div>
              <div className="modal-body ">
                <p className="flow-text">Are You Sure To Delete This?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.delJudge.bind(this)} >Delete</button>
              </div>
            </div>
          </div>
        </div>
        {/* end confirm judge delete modal */}
        {/* update Judge modal */}
        <div className="modal fade" id={"updateJudge" + this.props.judgeId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Update Judge</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <div className="row pl-3 pr-3">
                  <div className="col-sm-12">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Judge Name</span>
                      </div>
                      <input id={"judge-name" + this.props.judgeId} type="text" defaultValue={this.props.judgeName} className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Description</span>
                      </div>
                      <textarea id={"judge-description" + this.props.judgeId} defaultValue={this.props.judgeDescription} className="form-control" aria-label="With textarea"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.updateJudge.bind(this)} >Save changes</button>
              </div>
            </div>
          </div>
        </div>
        {/*End update Contestant modal */}
        {/* Details Judge modal */}
        <div className="modal fade" id={"detailsJudgeModal" + this.props.judgeId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Judge</h5>

                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <div className='row m-3'>
                  <div className="input-group mb-3">
                    <input type="text" id={"access-code-field" + this.props.judgeId} className="form-control" defaultValue={this.props.judgeId} placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                  </div>
                </div>
                <div className="row pl-2 pr-2">
                  {/* qr code fetcher api */}
                  <div className="col-8">
                    <a href={"https://api.qrserver.com/v1/create-qr-code/?data=" + this.props.judgeId + "&amp;size=200x200"} download="thefile">
                      <img src={"https://api.qrserver.com/v1/create-qr-code/?data=" + this.props.judgeId + "&amp;size=200x200"} alt="dff" title="sdsdfsf" />
                    </a>
                  </div>
                  <div className="col-4">
                    <h4>{this.props.judgeName}</h4>
                    <p>{this.props.judgeDescription}</p>
                  </div>

                </div>
              </div>
              {/* <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                  </div> */}
            </div>
          </div>
        </div>
        {/*End Details Judge modal */}
      </div>
    )
  }
}

// ***************************************************** END Candidates ****************************************************
// -------------------------------------------------------- Criteria --------------------------------------------------------
class CriteriaOnModal extends React.Component {
  componentDidMount() {
    feather.replace();
  }
  delCriteria() {
    firebase.database().ref().child(refCriteria).child(this.props.criteriaEventid).child(this.props.criteriaKey).remove();
    getCriteria(this.props.criteriaEventid);
    $("#confimrDeleteCriteria" + this.props.criteriaKey).modal('hide');
    criteriaPieGraph(this.props.criteriaEventid);
  }
  updateCriteria() {
    var updatedCriteriaName = $("#c-name" + this.props.criteriaKey).val();
    var updatedCriteriPercentage = $("#c-percent" + this.props.criteriaKey).val();
    console.log("updateCriteia : " + refCriteria + this.props.criteriaEventid + this.props.criteriaKey + updatedCriteriaName + " " + updatedCriteriPercentage);
    firebase.database().ref().child(refCriteria).child(this.props.criteriaEventid).child(this.props.criteriaKey).update({
      criteriaName: updatedCriteriaName,
      criteriaPercentage: updatedCriteriPercentage
    });
    $("#updateCriteriaModal" + this.props.criteriaKey).modal('hide');
    getCriteria(this.props.criteriaEventid);
    criteriaPieGraph(this.props.criteriaEventid);
  }
  render() {
    return (
      <div className="list-group-item list-group-item-action align-items-start">
        <div href="" >
          <div className="d-flex w-100 justify-content-between ">
            <h5 className="mb-1 align-middle">{this.props.criterianame}</h5>
            {/* <small>3 days ago</small> */}

            <div className="align-middle">
              {this.props.criteriapercentage}%
              <i className="mb-1 ml-3 align-middle" data-toggle="modal" data-target={"#updateCriteriaModal" + this.props.criteriaKey} data-feather="edit-3"></i>
              <i className="mb-1 ml-2 align-middle text-danger" data-toggle="modal" data-target={"#confimrDeleteCriteria" + this.props.criteriaKey} data-feather="trash-2"></i>
            </div>

          </div>

          {/* <small>Donec id elit non mi porta.</small> */}
        </div>
        {/* confirm judge delete modal */}
        <div className="modal fade" id={"confimrDeleteCriteria" + this.props.criteriaKey} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Confirm Delete</h5>
              </div>
              <div className="modal-body ">
                <p className="flow-text">Are You Sure To Delete This?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.delCriteria.bind(this)} >Delete</button>
              </div>
            </div>
          </div>
        </div>
        {/* end confirm judge delete modal */}
        {/* update Criteria modal */}
        <div className="modal fade" id={"updateCriteriaModal" + this.props.criteriaKey} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Edit Criteria</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <div className="row pl-3 pr-3">
                  <div className="col-sm-9">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Criteria Name</span>
                      </div>
                      <input id={"c-name" + this.props.criteriaKey} defaultValue={this.props.criterianame} type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="input-group mb-3">
                      <input id={"c-percent" + this.props.criteriaKey} defaultValue={this.props.criteriapercentage} type="text" className="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">%</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" onClick={this.updateCriteria.bind(this)} className="btn btn-primary" >Save changes</button>
              </div>
            </div>
          </div>
        </div>

        {/*End update Criteria modal */}
      </div>

    )
  }
}

class Criteria extends React.Component {
  componentDidMount() {
    feather.replace();
  }
  delCriteria() {
    firebase.database().ref().child(refCriteria).child(this.props.criteriaEventid).child(this.props.criteriaKey).remove();
    getCriteria(this.props.criteriaEventid);
    $("#confimrDeleteCriteria" + this.props.criteriaKey).modal('hide');
    criteriaPieGraph(this.props.criteriaEventid);
  }
  updateCriteria() {
    var updatedCriteriaName = $("#c-name" + this.props.criteriaKey).val();
    var updatedCriteriPercentage = $("#c-percent" + this.props.criteriaKey).val();
    console.log("updateCriteia : " + refCriteria + this.props.criteriaEventid + this.props.criteriaKey + updatedCriteriaName + " " + updatedCriteriPercentage);
    firebase.database().ref().child(refCriteria).child(this.props.criteriaEventid).child(this.props.criteriaKey).update({
      criteriaName: updatedCriteriaName,
      criteriaPercentage: updatedCriteriPercentage
    });
    $("#updateCriteriaModal" + this.props.criteriaKey).modal('hide');
    getCriteria(this.props.criteriaEventid);
    criteriaPieGraph(this.props.criteriaEventid);
  }
  render() {
    return (
      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div href="" >
          <div className="d-flex w-100 justify-content-between ">
            <h5 className="mb-1 align-middle">{this.props.criterianame}</h5>
            {/* <small>3 days ago</small> */}

            <div className="align-middle">
              {this.props.criteriapercentage}%
              <i className="mb-1 ml-3 align-middle" data-toggle="modal" data-target={"#updateCriteriaModal" + this.props.criteriaKey} data-feather="edit-3"></i>
              <i className="mb-1 ml-2 align-middle text-danger" data-toggle="modal" data-target={"#confimrDeleteCriteria" + this.props.criteriaKey} data-feather="trash-2"></i>
            </div>

          </div>

          {/* <small>Donec id elit non mi porta.</small> */}
        </div>
        {/* confirm criteria delete modal */}
        <div className="modal fade" id={"confimrDeleteCriteria" + this.props.criteriaKey} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Confirm Delete</h5>
              </div>
              <div className="modal-body ">
                <p className="flow-text">Are You Sure To Delete This?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.delCriteria.bind(this)} >Delete</button>
              </div>
            </div>
          </div>
        </div>
        {/* end confirm criteria delete modal */}
        {/* update Criteria modal */}
        <div className="modal fade" id={"updateCriteriaModal" + this.props.criteriaKey} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Update Criteria</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <div className="row pl-3 pr-3">
                  <div className="col-sm-9">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Criteria Name</span>
                      </div>
                      <input id={"c-name" + this.props.criteriaKey} defaultValue={this.props.criterianame} type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="input-group mb-3">
                      <input id={"c-percent" + this.props.criteriaKey} defaultValue={this.props.criteriapercentage} type="text" className="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" onClick={this.updateCriteria.bind(this)} className="btn btn-primary" >Save changes</button>
              </div>
            </div>
          </div>
        </div>

        {/*End update Criteria modal */}
      </div>

    )
  }
}


// ***************************************************** END Criteria ****************************************************

// -------------------------------------------------------- Events --------------------------------------------------------
class Getevents extends React.Component {

  delEvent() {
    deleteEvent(this.props.event_id);
    $("#confirmdelete" + this.props.event_id).modal('hide');
    getEvents();
  }
  addCriteria() {
    var eventid = this.props.event_id;
    var criteriaName = $("#c-name" + this.props.event_id).val();
    var criteriaPercent = $("#c-percent" + this.props.event_id).val();
    console.log(criteriaName + " " + criteriaPercent);
    if (this.validateCriteria() == true) {
      var criteriaKey = firebase.database().ref().child(refCriteria).child(eventid).push().key;

      firebase.database().ref().child(refCriteria).child(this.props.event_id).child(criteriaKey).set({
        eventKey: eventid,
        criteriaKey: criteriaKey,
        criteriaName: criteriaName,
        criteriaPercentage: criteriaPercent
      });
      getCriteria(eventid);
      $("#addcriteriamodel" + this.props.event_id).modal('hide');
      $("#c-name" + this.props.event_id).val("");
      $("#c-percent" + this.props.event_id).val("");
      criteriaPieGraph(this.props.event_id);
    } else {
      alert("input invalid");
    }
  }
  validateCriteria() {
    var criteriaPercent = $("#c-percent" + this.props.event_id).val();
    var criteriaName = $("#c-name" + this.props.event_id).val();
    if (criteriaPercent > 0 && criteriaName.trim() != "" && criteriaPercent != "") {
      return true;
    } else {
      return false;
    }
  }
  backdropOffModal() {
    console.log("clikced");
    $("#addcriteriamodel" + this.props.event_id).modal({ backdrop: false });
  }
  addContestant() {
    var contestantName = $("#contestant-name" + this.props.event_id).val();
    var contestantDescription = $("#contestant-description" + this.props.event_id).val();

    var candidatekey = firebase.database().ref().child(refCandidates).child(this.props.event_id).push().key;

    if(contestantName.split(' ').join('') =="" || contestantDescription.split(' ').join('') == ""){
      alert("Fields are required to be filled up");
    }
    else{
      firebase.database().ref().child(refCandidates).child(this.props.event_id).child(candidatekey).set({
        contestantname: contestantName,
        contestantDescription: contestantDescription,
        eventid: this.props.event_id,
        contestantid: candidatekey
      });
      getCandidates(this.props.event_id);
      $("#addContestantModal" + this.props.event_id).modal('hide');
      $("#contestant-name" + this.props.event_id).val("");
      $("#contestant-descriptions" + this.props.event_id).val("");
    }

 
  }
  addJudge() {
    var judgeName = $("#judge-name" + this.props.event_id).val();
    var judgeDescription = $("#judge-description" + this.props.event_id).val();
    var judgeKey = firebase.database().ref().child(refJudge).child(this.props.event_id).push().key;

    if(judgeName.split(" ").join('')=="" ||judgeDescription.split(" ").join('')=="" ){
      alert("Fields are required to be filled up");
    }else{      
    firebase.database().ref().child(refJudge).child(this.props.event_id).child(judgeKey).set({
      judgeName: judgeName,
      judgeDescription: judgeDescription,
      eventid: this.props.event_id,
      judgeId: judgeKey
    });
    firebase.database().ref().child("routeJudges").child(judgeKey).set({
      judgeName: judgeName,
      judgeDescription: judgeDescription,
      eventid: this.props.event_id,
      judgeId: judgeKey
    });
    getJudge(this.props.event_id);
    $("#addJudgeModal" + this.props.event_id).modal('hide');
    $("#judge-name" + this.props.event_id).val("");
    $("#judge-description" + this.props.event_id).val("");

    }

  }
  componentDidMount() {
    feather.replace();

    getCandidates(this.props.event_id);
    getCriteria(this.props.event_id);
    getJudge(this.props.event_id);
    criteriaPieGraph(this.props.event_id);
    getResults(this.props.event_id);
  }
  updateEventName() {
    var update = $("#eventname" + this.props.event_id).val();
      var date = $("#eventDate" + this.props.event_id).val();
    updateEventName(update, this.props.event_id,date);
  }

  printResults(){
    var win = window.open('details.html?eventid='+this.props.event_id,"_blank");
    win.focus();
  }

  render() {
    return (

      <div className="col-sm-12 mb-2">
        <div className="card rounded border-light">
          <div className="card-header border-light text-primary bg-white">
            <div className="row">
              <div className="col-sm-10">
                <h5 className="d-flex w-100 justify-content-between mt-4 text-truncate" data-toggle="collapse" data-target={"#collapseOne" + this.props.event_id} aria-expanded="true" aria-controls="collapseOne">
                  {this.props.event_name}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">{this.props.event_date}</h6>
              </div>
              <div className="col-sm-2">
                <div className="row align-middle">
                  <div className="btn-group mt-3" role="group" aria-label="Second group">
                    <button type="button" className="btn btn-outline-success mt-2" data-toggle="modal" data-target={"#editeventname" + this.props.event_id}>
                      <i data-feather="edit-3"></i>Edit
                    </button>
                    <button type="button" className="btn btn-outline-danger mt-2" data-toggle="modal" data-target={"#confirmdelete" + this.props.event_id}>
                      <i data-feather="trash-2"></i> Delete
                    </button>
                    {/* confirm event delete modal */}
                    <div className="modal fade" id={"confirmdelete" + this.props.event_id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Confirm Delete</h5>
                          </div>
                          <div className="modal-body ">
                            <p className="flow-text">Are You Sure To Delete This?</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.delEvent.bind(this)} >Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end confirm event delete modal */}
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* Edit Event title */}
          <div className="modal fade" id={"editeventname" + this.props.event_id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalCenterTitle">Event Name</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body ">
                  <div className="row pl-3 pr-3">
                    <div className="col-sm-12">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">Event Name</span>
                        </div>
                        <input id={"eventname" + this.props.event_id} type="text" className="form-control" defaultValue={this.props.event_name} placeholder="Event name" aria-label="Username" aria-describedby="basic-addon1" />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">Event Date</span>
                        </div>
                        <input id={"eventDate" + this.props.event_id} type="text" className="form-control" defaultValue={this.props.event_date} placeholder="Event Date" aria-label="Username" aria-describedby="basic-addon1" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={this.updateEventName.bind(this)} >Save changes</button>
                </div>
              </div>
            </div>
          </div>
          {/* End Edit Event title modal */}
           {/* event body card */}
          <div className="card-body collapse hide" id={"collapseOne" + this.props.event_id} aria-labelledby="headingOne" data-parent="#accordion">

            <div className="container-fluid col-sm-12 m-2">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item mr-3">
                  <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href={"#pills-home" + this.props.event_id} role="tab" aria-controls="pills-home" aria-selected="true">Contestant</a>
                </li>
                <li className="nav-item mr-3">
                  <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href={"#pills-profile" + this.props.event_id} role="tab" aria-controls="pills-profile" aria-selected="false">Criteria</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href={"#pills-contact" + this.props.event_id} role="tab" aria-controls="pills-contact" aria-selected="false">Judges</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="pills-results-tab" data-toggle="pill" href={"#pills-results" + this.props.event_id} role="tab" aria-controls="pills-results" aria-selected="false">Results</a>
                </li>
              </ul>
              <div className="row">
                <div className="tab-content w-100" id="pills-tabContent">
                  <div className="tab-pane w-100 fade show active" id={"pills-home" + this.props.event_id} role="tabpanel" aria-labelledby="pills-home-tab">
                    <button type="button" className="btn btn-outline-primary mb-2" data-toggle="modal" data-target={"#addContestantModal" + this.props.event_id}>
                      Add Contestant
                      </button>
                    {/* Contestant Container */}
                    <div id={"candidate-container" + this.props.event_id}>


                    </div>
                    {/* add Contestant modal */}
                    <div className="modal fade" id={"addContestantModal" + this.props.event_id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Contestant</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body ">
                            <div className="row pl-3 pr-3">
                              <div className="col-sm-12">
                                <div className="input-group mb-3">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Contestant Name</span>
                                  </div>
                                  <input id={"contestant-name" + this.props.event_id} type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                                </div>
                              </div>
                              <div className="col-sm-12">
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">Description</span>
                                  </div>
                                  <textarea id={"contestant-description" + this.props.event_id} className="form-control" aria-label="With textarea"></textarea>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" onClick={this.addContestant.bind(this)} className="btn btn-primary" >Save changes</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*End add Contestant modal */}

                    {/* End Contestant Container */}


                  </div>
                  <div className="tab-pane fade" id={"pills-profile" + this.props.event_id} role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className="row">
                      <div className="col-sm-6 m2">
                        {/* Criteria Container */}
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="input-group mb-3">

                              <input id={"c-name" + this.props.event_id} type="text" className="form-control" placeholder="Criteria Name" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="input-group mb-3">
                              <input id={"c-percent" + this.props.event_id} max-length="2" className="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                              <div className="input-group-append">
                                <span className="input-group-text" id="basic-addon2">%</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="input-group mb-3">
                              <button type="button" id={"addCriteria" + this.props.event_id} onClick={this.addCriteria.bind(this)} className="btn btn-primary" >Add Criteria</button>
                            </div>
                          </div>
                        </div>
                        {/* <button type="button" onClick={this.backdropOffModal.bind(this)} className="btn btn-outline-primary mb-2" data-toggle="modal">
                      Add Criteria
                     </button> */}
                        <div id={"messageContainer" + this.props.event_id}>

                        </div>
                        <div id={"criteria-container" + this.props.event_id}>


                        </div>

                        {/* add Criteria modal */}
                        <div className="modal fade" id={"addcriteriamodel" + this.props.event_id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Add Criteria</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body ">
                                <div className="row pl-3 pr-3">
                                  <div className="col-sm-6">
                                    <div className="input-group mb-3">
                                      <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Criteria Name</span>
                                      </div>
                                      <input id={"c-name" + this.props.event_id} type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                  </div>
                                  <div className="col-sm-3">
                                    <div className="input-group mb-3">
                                      <input id={"c-percent" + this.props.event_id} type="text" className="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                      <div className="input-group-append">
                                        <span className="input-group-text" id="basic-addon2">%</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-3">
                                    <div className="input-group mb-3">
                                      <button type="button" className="btn btn-primary" >Add Criteria</button>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="w-100 ml-3 mr-3" id={"criteriaOnModalContainer" + this.props.event_id}></div>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" onClick={this.addCriteria.bind(this)} className="btn btn-primary" >Save changes</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/*End add Criteria modal */}

                        {/* End Criteria Container */}
                      </div>
                      <div className="col-sm-6">
                        <div className="row">
                          <canvas id={"myChart" + this.props.event_id} width="100%"></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id={"pills-contact" + this.props.event_id} role="tabpanel" aria-labelledby="pills-contact-tab">
                    <div className="row">
                      <div className="col-sm-12 m2">
                        <button type="button" className="btn btn-outline-primary mb-2" data-toggle="modal" data-target={"#addJudgeModal" + this.props.event_id}>
                          Add Judge
                      </button>
                        <div id={"judge-container" + this.props.event_id}>
                          {/* Judge Container */}

                        </div>
                        {/* add Judge modal */}
                        <div className="modal fade" id={"addJudgeModal" + this.props.event_id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Judge</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body ">
                                <div className="row pl-3 pr-3">
                                  <div className="col-sm-12">
                                    <div className="input-group mb-3">
                                      <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Judge Name</span>
                                      </div>
                                      <input id={"judge-name" + this.props.event_id} type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                  </div>
                                  <div className="col-sm-12">
                                    <div className="input-group">
                                      <div className="input-group-prepend">
                                        <span className="input-group-text">Description</span>
                                      </div>
                                      <textarea id={"judge-description" + this.props.event_id} className="form-control" aria-label="With textarea"></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.addJudge.bind(this)}>Save changes</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*End add Judge modal */}

                        {/* End Judge Container */}
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id={"pills-results" + this.props.event_id} role="tabpanel" aria-labelledby="pills-results-tab">
                    <div className="row">
                      <div className="col-sm-12 m2">
                        <button type="button" className="btn btn-outline-primary mb-2" onClick={this.printResults.bind(this)} data-toggle="modal" data-target={"#" + this.props.event_id}>
                          Print Results
                          </button>
                        <div id={"results-container" + this.props.event_id}>
                        {/* Results Container */}


                        </div>
                        {/* End Results Container */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end card body */}


          </div>
        </div>
      </div>

    );
  }
}

// ###################################################### Evennts Functions ###############################################
function writeEventName() {
  var eventname = document.getElementById('eventname').value;
  var currentDate = getCurrentDate();
  var eventpostkey = firebase.database().ref().child('event').push().key;

  if(eventname.split(" ").join("") == ""){
    alert("Field must be filled up");
  }else{
    firebase.database().ref('events/' + eventpostkey).set({
      eventname: eventname,
      date: currentDate,
      key: eventpostkey
    });
    $('#exampleModalCenter').modal('hide');
    $("#eventname").val("");
  }
  
  getEvents();
 
}

function getResults(key) {
  var candidateContainer = document.getElementById("results-container" + key);
  var candidateObjects = [];
  firebase.database().ref(refCandidates).child(key).once('value', function (snapshot) {
    snapshot.forEach(function (childsnapshot) {
      candidateObjects.push(childsnapshot.val());
    });
    var candidateListItem = candidateObjects.map((canidateObj) =>
      <Results key={canidateObj.contestantid} contestantid={canidateObj.contestantid} eventid={canidateObj.eventid} candidatedescription={canidateObj.contestantDescription} candidatename={canidateObj.contestantname} />
    );
    ReactDOM.render(
      <div className="list-group mt-2 mb-2">
        {candidateListItem}
      </div>, candidateContainer
    )
  });
}

function getCandidates(key) {
  var candidateContainer = document.getElementById("candidate-container" + key);
  var candidateObjects = [];
  firebase.database().ref(refCandidates).child(key).once('value', function (snapshot) {
    snapshot.forEach(function (childsnapshot) {
      candidateObjects.push(childsnapshot.val());
    });
    var candidateListItem = candidateObjects.map((canidateObj) =>
      <Candidates key={canidateObj.contestantid} contestantid={canidateObj.contestantid} eventid={canidateObj.eventid} candidatedescription={canidateObj.contestantDescription} candidatename={canidateObj.contestantname} />
    );
    ReactDOM.render(
      <div className="list-group mt-2 mb-2">
        {candidateListItem}
      </div>, candidateContainer
    )
  });
}

function deleteCandidate(eventid, constestantid) {

  return firebase.database().ref().child(refCandidates).child(eventid).child(constestantid).remove();
}

function updateCandidate(eventid, constestantid, contestantname, contestantDescription) {
  firebase.database().ref().child(refCandidates).child(eventid).child(constestantid).update({
    contestantname: contestantname,
    contestantDescription: contestantDescription
  });
}

function getJudge(key) {
  var judgeContainer = document.getElementById("judge-container" + key);
  var judgeObjects = [];
  firebase.database().ref(refJudge).child(key).once('value', function (snapshot) {
    snapshot.forEach(function (childsnapshot) {

      judgeObjects.push(childsnapshot.val());
    });
    var judgeListItem = judgeObjects.map((judgeObj) =>
      <Judge key={judgeObj.judgeId} judgeId={judgeObj.judgeId} judgeEventId={judgeObj.eventid} judgeDescription={judgeObj.judgeDescription} judgeName={judgeObj.judgeName} />
    );
    ReactDOM.render(
      <div className="list-group mt-2 mb-2">
        {judgeListItem}
      </div>, judgeContainer
    )
  });
}

function getCriteria(key) {
  var criteriaContainer = document.getElementById("criteria-container" + key);
  var criteriaOnModalContainer = document.getElementById("criteriaOnModalContainer" + key);
  var criteriaObjects = [];
  var criteriaOnModalListObjects = [];
  var totalPercent = 0;
  firebase.database().ref(refCriteria).child(key).once('value', function (snapshot) {
    snapshot.forEach(function (childsnapshot) {

      criteriaObjects.push(childsnapshot.val());
      totalPercent += parseInt(childsnapshot.val().criteriaPercentage);
    });
    var criteriaListObjects = criteriaObjects.map((criteriaObjects) =>
      <Criteria key={criteriaObjects.criteriaKey} criteriaEventid={criteriaObjects.eventKey} criteriaKey={criteriaObjects.criteriaKey} criterianame={criteriaObjects.criteriaName} criteriapercentage={criteriaObjects.criteriaPercentage} />
    );
    var criteriaOnModalListObjects = criteriaObjects.map((criteriaObjects) =>
      <CriteriaOnModal key={criteriaObjects.criteriaKey} criteriaEventid={criteriaObjects.eventKey} criteriaKey={criteriaObjects.criteriaKey} criterianame={criteriaObjects.criteriaName} criteriapercentage={criteriaObjects.criteriaPercentage} />
    );
    ReactDOM.render(
      <div className="list-group" id="list-tab" role="tablist" >
        {criteriaListObjects}
      </div>, criteriaContainer
    )
    ReactDOM.render(
      <div className="list-group" id="list-tab" role="tablist" >
        {criteriaOnModalListObjects}
      </div>, criteriaOnModalContainer
    )
    var percentMissing = 100 - totalPercent;
    if (percentMissing == 0) {
      $("#c-name" + key).attr("disabled", true);
      $("#c-percent" + key).attr("disabled", true);
      $("#addCriteria" + key).attr("disabled", true);
    } else {
      $("#c-name" + key).attr("disabled", false);
      $("#c-percent" + key).attr("disabled", false);
      $("#addCriteria" + key).attr("disabled", false);
    }

    if (percentMissing > 0) {
      ReactDOM.render(
        <div className="alert alert-danger" role="alert">
          {100 - totalPercent}% percentage missing
          </div>
        , document.getElementById('messageContainer' + key)
      )
    } else if (percentMissing < 0) {

      ReactDOM.render(
        <div className="alert alert-danger" role="alert">
          Percentage Overlaped by {totalPercent - 100}%
          </div>
        , document.getElementById('messageContainer' + key)
      )
    }
    else {
      ReactDOM.render(
        <div className="alert alert-success" role="alert">
          Ok we are all set!
          </div>
        , document.getElementById('messageContainer' + key)
      )
    }
  });
}

function getEvents() {
  var eventString = [];
  var eventsObjects = [];
  var eventDate = [];

  var eventscontainer = document.getElementById("eventscontainer");
  firebase.database().ref("events").orderByChild("key").once('value', function (snapshot) {
    snapshot.forEach(function (childsnapshot) {
      console.log(childsnapshot.val());
      eventString.push(childsnapshot.val().eventname);
      eventsObjects.push(childsnapshot.val());
    });
    eventsObjects.reverse();
    var listItem = eventsObjects.map((eventObject) =>
      <Getevents key={eventObject.key} event_id={eventObject.key} event_name={eventObject.eventname} event_date={eventObject.date} />
    );
    ReactDOM.render(
      <div className="row">
        {listItem}</div>, eventscontainer
    );
  });

}

function deleteEvent(event_id) {

  return firebase.database().ref("events/" + event_id).remove();
}

function updateEventName(name, key_id,date) {

  firebase.database().ref('events/' + key_id).update({ eventname: name,
  date:date });
  getEvents();
  var eventnameid = "#editeventname" + key_id;
  $(eventnameid).modal('hide');
  $(eventnameid).val("");

}

// ***************************************************** END Events ****************************************************

//***************************************************** END Tabulation ****************************************************

//---------------------------------------------start Announcements ----------------------------------------------------
function getAnnouncements() {
  var announcementsObjects = [];
  var announcementsContainer = document.getElementById("announcementsContainer");
  firebase.database().ref(refAnnouncements).orderByChild("key").once('value', function (snapshot) {
    snapshot.forEach(function (childsnapshot) {
      announcementsObjects.push(childsnapshot.val());
    });
    announcementsObjects.reverse();
    var announcementsItems = announcementsObjects.map((announcementsObj) =>
      <AnnouncementContainer key={announcementsObj.key} id={announcementsObj.key} announcementTitle={announcementsObj.announcementTitle} announcementDescription={announcementsObj.announcementDescription} date={announcementsObj.currentDate} time={announcementsObj.currentTimeStomp} />
    );
    ReactDOM.render(
      <div className="row">
        {announcementsItems}
      </div>, announcementsContainer
    );
  });
}
class MainAnnouncement extends React.Component {
  componentDidMount() {
    this.getAnnouncements();
  }
  addAnnouncement() {
    var announcementTitle = $("#announcementName").val();
    var announcementDescription = $("#announcementDescription").val();
    var currentDate = getCurrentDate();
    var currentTimeStomp = getCurrentTimeStomp();
    var announcementKey = firebase.database().ref().push().key;

    firebase.database().ref().child(refAnnouncements).child(announcementKey).set({
      announcementTitle: announcementTitle,
      announcementDescription: announcementDescription,
      currentDate: currentDate,
      currentTimeStomp: currentTimeStomp,
      key: announcementKey
    });
    $("#exampleModalCenter").modal('hide');
    this.getAnnouncements();

  }

  getAnnouncements() {
    getAnnouncements();
  }
  render() {
    return (
      <div className="container pt-5">
        <div className="col-sm-12">
          <button type="button" className="btn btn-success ml-2" data-toggle="modal" data-target="#exampleModalCenter">
            Add Announcements
          </button>
          <div id="announcementsContainer" className="mt-3">

          </div>
        </div>
        {/* Add Announcement Modal */}
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-success" id="exampleModalCenterTitle">Add Announcements</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <div className="row">
                  <div className="col-sm-12">
                    <p className="text-secondary ml-1">Announcement</p>
                    <div className="input-group  mb-3">
                      <input id="announcementName" type="text" className="form-control rounded border-success" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <p className="text-secondary ml-3">Description</p>
                  <div className="col-sm-12">
                    <div className="input-group" style={{ height: 300 + 'px' }}>
                      <textarea id="announcementDescription" className="form-control rounded border-success" aria-label="With textarea"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-success" onClick={this.addAnnouncement.bind(this)}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
        {/* End Add Announcement Modal */}
      </div>
    );
  }
}
class AnnouncementContainer extends React.Component {
  componentDidMount() {
    feather.replace();
  }
  updateAnnouncement() {
    var updateDes = $("#announcementDescription" + this.props.id).val();
    var updateTitle = $("#announcementName" + this.props.id).val();
    firebase.database().ref().child(refAnnouncements).child(this.props.id).update({
      announcementTitle: updateTitle,
      announcementDescription: updateDes,
    });
    $("#editmodal" + this.props.id).modal("hide");
    getAnnouncements();
  }
  deleteAnnouncement() {
    firebase.database().ref().child(refAnnouncements).child(this.props.id).remove();
    $("#confirmdelete" + this.props.id).modal("hide");
    getAnnouncements();
  }
  render() {
    return (
      <div className="card w-100 mb-3" >
        <div className="card-body">
          <h5 className="card-title">{this.props.announcementTitle}</h5>
          <p className="font-weight-light"><i data-feather="calendar" ></i>{this.props.date} at {this.props.time}</p>
          <p className="card-text">{this.props.announcementDescription}</p>
          <button className="btn btn-danger mr-3" data-toggle="modal" data-target={"#confirmdelete" + this.props.id}><i data-feather="trash-2"></i> Delete</button>
          <button className="btn btn-success" data-toggle="modal" data-target={"#editmodal" + this.props.id}><i data-feather="edit" ></i> Edit</button>
        </div>
        {/* edit modal start */}
        <div className="modal fade" id={"editmodal" + this.props.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-success" id="exampleModalCenterTitle">Add Announcements</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <div className="row">
                  <div className="col-sm-12">
                    <p className="text-secondary ml-1">Announcement</p>
                    <div className="input-group  mb-3">
                      <input id={"announcementName" + this.props.id} defaultValue={this.props.announcementTitle} type="text" className="form-control rounded border-success" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <p className="text-secondary ml-3">Description</p>
                  <div className="col-sm-12">
                    <div className="input-group" style={{ height: 300 + 'px' }}>
                      <textarea id={"announcementDescription" + this.props.id} defaultValue={this.props.announcementDescription} className="form-control rounded border-success" aria-label="With textarea"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-success" onClick={this.updateAnnouncement.bind(this)}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
        {/* edit modal start */}
        {/* confirm announcements delete modal */}
        <div className="modal fade" id={"confirmdelete" + this.props.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Confirm Delete</h5>
              </div>
              <div className="modal-body ">
                <p className="flow-text">Are You Sure To Delete This?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.deleteAnnouncement.bind(this)} >Delete</button>
              </div>
            </div>
          </div>
        </div>
        {/* end confirm announcements delete modal */}
      </div>
    );
  }
}

//---------------------------------------------End Announcements ----------------------------------------------------

function writeCriteria() {

}
function getCurrentTimeStomp() {
  return new Date().toLocaleTimeString();
}
function getCurrentDate() {
  var d = new Date();
  return getMonthString(d.getMonth()) + " " + ("0" + (d.getDate())).slice(-2) + ", " + d.getFullYear();
}
function getMonthString(month) {

  switch (month) {
    case 0:
      return "January";
      break;
    case 1:
      return "Febuary";
      break;
    case 2:
      return "March";
      break;
    case 3:
      return "April";
      break;
    case 4:
      return "May";
      break;
    case 5:
      return "June";
      break;
    case 6:
      return "July";
      break;
    case 7:
      return "August";
      break;
    case 8:
      return "September";
      break;
    case 9:
      return "October";
      break;
    case 10:
      return "November";
      break;
    case 11:
      return "December";
      break;
    default:
      return "Month Doesnt Exist";
  }
}
function criteriaPieGraph(eventId) {

  const ctx = document.getElementById("myChart" + eventId).getContext('2d');
  ctx.clearRect(0, 0, document.getElementById("myChart" + eventId).width, document.getElementById("myChart" + eventId).height);
  var criteriaPercent = [];
  var criteriaLabel = [];
  firebase.database().ref(refCriteria).child(eventId).once('value', function (snapshot) {
    snapshot.forEach(function (childsnapshot) {
      criteriaPercent.push(childsnapshot.val().criteriaPercentage);
      criteriaLabel.push(childsnapshot.val().criteriaName);
      console.log(childsnapshot.val().criteriaPercentage)
    });
    var data = {
      datasets: [{
        data: criteriaPercent,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],

        borderWidth: 2
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: criteriaLabel
    };
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: data
    });
  });
}

ReactDOM.render(
  <div>
    <SideNav ficon="grid" cname="sideNav-menus-font nav-link " lname={dashboard} eventc={(e) => renderDashboard()} />
    <SideNav ficon="layers" cname="sideNav-menus-font nav-link custom-active" lname={contest} eventc={(e) => renderTabulation()} />
  </div>
  , sidenNaveElement);
feather.replace();
