var urlParams = new URLSearchParams(window.location.search);
//console.log(urlParams.get('eventid'));

var event_id = urlParams.get("eventid");
var mainContainer = document.getElementById("mainContainer");
var printingOptions = document.getElementById("printingOptions");
getEvent();
function getEvent() {
  firebase
    .database()
    .ref("events")
    .child(event_id)
    .once("value", function(dataSnapshot) {
      console.log(dataSnapshot.val());
      ReactDOM.render(
        <MainContainer eventname={dataSnapshot.val().eventname} date = {dataSnapshot.val().date} />,
        mainContainer
      );
      ReactDOM.render(
        <React.Fragment>
          <h5 className = "text-info">{dataSnapshot.val().date}</h5>
        </React.Fragment>,
        document.querySelector("#dateAndTime")
      )
    });
}

class PrintingOptions extends React.Component {
  state = {};
  getRatingByJudge() {
    let filterByJudge = $("#filterByJudge").val();
    if (filterByJudge == "All") {
      getEvent();
    } else {
      ReactDOM.render(
        <FilterByJudgeContainer key={filterByJudge} judgeId={filterByJudge} />,
        mainContainer
      );
    }
  }

  getjudges() {
    var judgesObjects = [];
    firebase
      .database()
      .ref("judges")
      .child(event_id)
      .on("value", function(dataSnapshot) {
        dataSnapshot.forEach(function(childsnapshot) {
          judgesObjects.push(childsnapshot.val());
        });
        var listItem = judgesObjects.map(objects => (
          <OptionItem
            key={objects.judgeId}
            optionName={objects.judgeName}
            optionValue={objects.judgeId}
            id={objects.judgeId}
          />
        ));

        ReactDOM.render(
          <React.Fragment>
            <OptionItem
              key={"All"}
              optionName={"Printing All Details"}
              optionValue={"All"}
              id={"All"}
            />
            {listItem}
          </React.Fragment>,
          document.getElementById("filterByJudge")
        );
      });
  }
  printpage() {
    window.print();
  }
  componentDidMount() {
    this.getjudges();
  }
  render() {
    return (
      <div className="col">
        <div className="row ml-2">
          <small>Printing Options</small>
        </div>
        <div className="row mt-1 w-50">
          <div className="col">
            <select
              onChange={this.getRatingByJudge.bind(this)}
              class="form-control form-control-lg"
              id="filterByJudge"
            >
              <option>Loading Please Wait</option>
            </select>
          </div>
          <div className="col">
            <button
              type="button"
              onClick={this.printpage.bind(this)}
              className="btn btn-outline-info m-1 d-print-none"
            >
              Print Results
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class OptionItem extends React.Component {
  render() {
    return (
      <option value={this.props.optionValue}>{this.props.optionName}</option>
    );
  }
}


class MainContainer extends React.Component {
  componentDidMount() {
    getCotestants();
    firebase
      .database()
      .ref()
      .on("child_changed", function(dataSnapshot) {
        getCotestants();
      });
  }

  render() {
    return (
      <div className="w-100">
      <div  className = "row d-flex justify-content-center">
      <h1>RESULTS</h1>
      </div>
        <div className="row mt-5">
          <div className="col">
            <div className  = "row">
            <h1>{this.props.eventname}</h1>
            </div>
          </div>
        </div>
        <div id="contestantList" className="row mt-5" />
        
        <div className="row mar200Top" id="judgeListSign" />
        <div className="row d-flex justify-content-center">
          <div className="col-sm-3 ml-3 mr-3  text-center">
            <div className="form-group input-group-lg">
              <input
                className="form-control text-dark text-uppercase font-weight-bold bg-transparent border-0 text-center"
                placeholder="Enter Name"
              />
            </div>
          </div>
          <div className="col-sm-3  ml-3 mr-3 text-center" >
          <div className="form-group input-group-lg">
              <input
                className="form-control text-dark text-uppercase font-weight-bold bg-transparent border-0 text-center"
               
                placeholder="Enter Name "
              />
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-sm-3  border-top border-dark ml-3 mr-3">
          <p className="text-center">Printed Name & Signature<br/>Tabulation Committee Chairperson</p>
           
          </div>
          <div className="col-sm-3  border-top border-dark ml-3 mr-3">
            <p className="text-center">Printed Name & Signature<br/>Student Affairs Officer</p>
           
          </div>
        </div>
      </div>
    );
  }
}

function getCotestants() {
  var id = event_id;
  var container = document.getElementById("contestantList");
  var totalRatingContainer = document.getElementById("totalRating" + id);
  var contestantObjecs = [];
  var resultsFinalObjects = [];
  firebase
    .database()
    .ref("candidates")
    .child(id)
    .once("value", function(dataSnapshot) {
      dataSnapshot.forEach(function(childsnapshot) {
        contestantObjecs.push(childsnapshot.val());
        var total = 0;
        var judgeNumber = 0;
        firebase
          .database()
          .ref("resultTotal")
          .child("event" + childsnapshot.val().eventid)
          .child("contestant" + childsnapshot.val().contestantid)
          .once("value", function(resultDataSnapshot) {
            resultDataSnapshot.forEach(function(resultChild) {
              total += resultChild.val().totalRating;
              judgeNumber++;
              console.log("results " + resultChild.val().totalRating);
            });
            var rating = {};
            if (isNaN(total / judgeNumber)) {
              rating.rate = 0;
            } else {
              rating.rate = total / judgeNumber;
            }
            rating.contestantId = childsnapshot.val().contestantid;
            rating.contestantname = childsnapshot.val().contestantname;
            resultsFinalObjects.push(rating);
            console.log(rating);

            resultsFinalObjects.sort(function(a, b) {
              return a.rate - b.rate;
            });
            resultsFinalObjects.reverse();
            for (var i in resultsFinalObjects) {
              console.log("sorted " + i + " " + resultsFinalObjects[i].rate);
            }

            var listItem = resultsFinalObjects.map((objects, index) => (
              <Contestant
                key={objects.contestantId}
                id={objects.contestantId}
                index={index + 1}
                contestantname={objects.contestantname}
                rating={Math.round(objects.rate * 100) / 100}
              />
            ));

            ReactDOM.render(
              <React.Fragment>{listItem}</React.Fragment>,
              container
            );
          });
      });
    });
}

class Judges extends React.Component {
  componentDidMount() {
    getRatings(this.props.contestantid, this.props.id);
    var contestantid = this.props.contestantid;
    var judgeid = this.props.id;
    firebase
      .database()
      .ref()
      .on("child_changed", function(dataSnapshot) {
        getRatings(contestantid, judgeid);
      });
    firebase
      .database()
      .ref()
      .on("child_added", function(dataSnapshot) {
        getRatings(contestantid, judgeid);
      });
  }
  render() {
    return (
      <div className="mt-3">
        <div className="row w-75">
          <div className="col text-success">
            <small className="text-muted">Judge Name</small>
            <h3>Judge</h3>
          </div>
          <div className="col">
            <div className="row mt-2">
              <small className="text-muted">Judge Rating</small>
            </div>
            <div
              id={"judgeRating" + this.props.contestantid + this.props.id}
              className="row"
            />
          </div>
        </div>
        <small className="text-info">Criteria</small>
        <div
          id={"criteriaRatings" + this.props.contestantid + this.props.id}
          className="row"
        />
      </div>
    );
  }
}

class CriteriaRating extends React.Component {
  componentDidMount() {
    var container = document.getElementById(
      "criterianame" +
        this.props.contestantid +
        this.props.judgeid +
        this.props.id
    );
    firebase
      .database()
      .ref("criteria")
      .child(event_id)
      .child(this.props.id)
      .once("value", function(dataSnapshot) {
        ReactDOM.render(
          <div className="w-100">
            {dataSnapshot.val().criteriaName +
              " - (" +
              dataSnapshot.val().criteriaPercentage +
              "%)"}
          </div>,
          container
        );
      });
  }
  render() {
    return (
      <div className="row w-75">
        <div
          id={
            "criterianame" +
            this.props.contestantid +
            this.props.judgeid +
            this.props.id
          }
          className="col"
        />
        <div className="col text-truncate">{this.props.rating}</div>
      </div>
    );
  }
}

function getjudges(id) {
  var container = document.getElementById("judgesContainer" + id);
  var judgesObjects = [];
  firebase
    .database()
    .ref("judges")
    .child(event_id)
    .once("value", function(dataSnapshot) {
      dataSnapshot.forEach(function(childsnapshot) {
        judgesObjects.push(childsnapshot.val());
      });
      var listItem = judgesObjects.map(objects => (
        <Judges
          key={objects.judgeId}
          contestantid={id}
          judgeName={objects.judgeName}
          id={objects.judgeId}
        />
      ));
      var listItemJudgeSign = judgesObjects.map(objects => (
        <JudgeItemSign
          key={objects.judgeId}
          contestantid={id}
          judgeName={objects.judgeName}
          id={objects.judgeId}
        />
      ));
      // ReactDOM.render(
      //   <React.Fragment>{listItemJudgeSign}</React.Fragment>,
      //   document.getElementById("judgeListSign")
      // );
      ReactDOM.render(<div className="container">{listItem}</div>, container);
    });
}

function getRatings(contestantid, judgeid) {
  var container = document.getElementById(
    "criteriaRatings" + contestantid + judgeid
  );
  var criteriaobjects = [];
  firebase
    .database()
    .ref("ratings")
    .child("event" + event_id)
    .child("contestant" + contestantid)
    .child("judge" + judgeid)
    .once("value", function(dataSnapshot) {
      dataSnapshot.forEach(function(childsnapshot) {
        criteriaobjects.push(childsnapshot.val());
      });
      var listItem = criteriaobjects.map(objects => (
        <CriteriaRating
          key={objects.criteriaId}
          id={objects.criteriaId}
          contestantid={contestantid}
          judgeid={judgeid}
          rating={objects.rating}
        />
      ));
      ReactDOM.render(<div className="container">{listItem}</div>, container);
    });

  var totalRatingContainer = document.getElementById(
    "judgeRating" + contestantid + judgeid
  );

  firebase
    .database()
    .ref("resultTotal")
    .child("event" + event_id)
    .child("contestant" + contestantid)
    .child("judge" + judgeid)
    .once("value", function(dataSnapshot) {
      ReactDOM.render(
        <h3 className="text-success">
          {Math.round(dataSnapshot.val().totalRating * 100) / 100}
        </h3>,
        totalRatingContainer
      );
    });
}

class Contestant extends React.Component {
  state = {
    show:"d-none",
    buttonShow:"visible"
  }
  show(){
    this.setState({
      show:this.state.show == "d-none"?"visible":"d-none",
      buttonShow:this.state.buttonShow == "d-none"?"visible":"d-none",

    })
  }
  componentDidMount() {
    getjudges(this.props.id);
  }
  render() {
    return (
      <div className="col-sm-6 mt-5">
        <div className="row w-100">
          <div className="col-sm-6">
            <div className="text-danger">{"Rank #" + this.props.index}</div>
            <button type="button" className={"btn btn-warning mt-2 "+this.state.buttonShow} onClick = {this.show.bind(this)}>Show Result</button>
            <h2 className={"text-capitalize font-weight-light text-danger "+this.state.show}>
              {this.props.contestantname}
            </h2>
          </div>
          <div className="col-sm-4 mt-2">
            <div className="text-danger">Final Rating</div>
            <h1 className="text-danger" >{this.props.rating} %</h1>
          </div>
        </div>
        <div id={"judgesContainer" + this.props.id} className={"row "+this.state.show} />
      </div>
    );
  }
}

class JudgeItemSign extends React.Component {
  render() {
    return (
      <div className="col-sm-3 border-top border-dark m-3 text-center">
        <h4>{this.props.judgeName}</h4>
      </div>
    );
  }
}

// ----------------------------------------------Judge Filters --------------------------------------------

class FilterByJudgeContainer extends React.Component {
  state = {
    judgeName: "this.props.judgeName"
  };

  getJudgeName() {
    let sup = this;
    firebase
      .database()
      .ref("judges")
      .child(event_id)
      .child(this.props.judgeId)
      .on("value", function(dataSnapshot) {
        console.log(dataSnapshot.val().judgeName);
        sup.setState({
          judgeName: dataSnapshot.val().judgeName
        });
      });
  }
  getContestants() {
    FilterJudgeGetCotestants(this.props.judgeId);
  }
  componentDidMount() {
    this.getJudgeName();
    this.getContestants();
    firebase
    .database()
    .ref("events")
    .child(event_id)
    .once("value", function(dataSnapshot) {
      console.log(dataSnapshot.val());
      ReactDOM.render(
        <React.Fragment>
        {dataSnapshot.val().eventname}
        </React.Fragment>,document.getElementById("JudgeEventName")
      );
    
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className = "row d-flex justify-content-center">
          <h1>JUDGING SHEET</h1>
        </div>
        <div className = "row">
          <h1 className = "text-primary"  id = "JudgeEventName"></h1>
        </div>
        <div className="row" id="judgeName">
          <h2>{this.state.judgeName}</h2>
        </div>
        <div className="row mb-5" id="contestantList" />
        <div className="row d-flex justify-content-center mt-5">
          <div className="col-sm-3 mt-5 border-top border-dark m-3 text-center">
            <h4>{this.state.judgeName}</h4>
          </div>
        </div>
      </div>
    );
  }
}

function JudgeFiltergetRatings(contestantid, judgeid) {
  var container = document.getElementById(
    "criteriaRatings" + contestantid + judgeid
  );
  var criteriaobjects = [];
  firebase
    .database()
    .ref("ratings")
    .child("event" + event_id)
    .child("contestant" + contestantid)
    .child("judge" + judgeid)
    .once("value", function(dataSnapshot) {
      dataSnapshot.forEach(function(childsnapshot) {
        criteriaobjects.push(childsnapshot.val());
      });
      var listItem = criteriaobjects.map(objects => (
        <CriteriaRating
          key={objects.criteriaId}
          id={objects.criteriaId}
          contestantid={contestantid}
          judgeid={judgeid}
          rating={objects.rating}
        />
      ));
      ReactDOM.render(<div className="container">{listItem}</div>, container);
    });

  var totalRatingContainer = document.getElementById(
    "judgeRating" + contestantid + judgeid
  );

  firebase
    .database()
    .ref("resultTotal")
    .child("event" + event_id)
    .child("contestant" + contestantid)
    .child("judge" + judgeid)
    .once("value", function(dataSnapshot) {
      ReactDOM.render(
        <h3 className="text-success">
          {Math.round(dataSnapshot.val().totalRating * 100) / 100}
        </h3>,
        totalRatingContainer
      );
    });
}

function FilterJudgeGetCotestants(judgeId) {
  var id = event_id;
  var container = document.getElementById("contestantList");
  var totalRatingContainer = document.getElementById("totalRating" + id);
  var contestantObjecs = [];
  var resultsFinalObjects = [];
  firebase
    .database()
    .ref("candidates")
    .child(id)
    .once("value", function(dataSnapshot) {
      dataSnapshot.forEach(function(childsnapshot) {
        contestantObjecs.push(childsnapshot.val());
        var total = 0;

        firebase
          .database()
          .ref("resultTotal")
          .child("event" + childsnapshot.val().eventid)
          .child("contestant" + childsnapshot.val().contestantid)
          .child("judge" + judgeId)
          .once("value", function(resultDataSnapshot) {
            var rating = {};
            rating.rate = resultDataSnapshot.val().totalRating;
            rating.contestantId = childsnapshot.val().contestantid;
            rating.contestantname = childsnapshot.val().contestantname;
            resultsFinalObjects.push(rating);
            console.log(rating);

            resultsFinalObjects.sort(function(a, b) {
              return a.rate - b.rate;
            });
            resultsFinalObjects.reverse();
            for (var i in resultsFinalObjects) {
              console.log("sorted " + i + " " + resultsFinalObjects[i].rate);
            }

            var listItem = resultsFinalObjects.map((objects, index) => (
              <ContestantFilterByJudge
                key={objects.contestantId}
                id={objects.contestantId}
                index={index + 1}
                judgeId={judgeId}
                contestantname={objects.contestantname}
                rating={Math.round(objects.rate * 100) / 100}
              />
            ));

            ReactDOM.render(
              <React.Fragment>{listItem}</React.Fragment>,
              container
            );
          });
      });
    });
    
}

function filterGetJudge(id, judgeid) {
  var container = document.getElementById("judgesContainer" + id);
  var judgesObjects = [];
  firebase
    .database()
    .ref("judges")
    .child(event_id)
    .child(judgeid)
    .once("value", function(dataSnapshot) {
      ReactDOM.render(
        <div className="container">
          <FilterJudges
            key={dataSnapshot.val().judgeId}
            contestantid={id}
            judgeName={dataSnapshot.val().judgeName}
            id={dataSnapshot.val().judgeId}
          />
        </div>,
        container
      );
    });
}

class ContestantFilterByJudge extends React.Component {
  componentDidMount() {
    filterGetJudge(this.props.id, this.props.judgeId);
  }
  render() {
    return (
      <div className="col-sm-6 mt-5">
        <div className="row w-100">
          <div className="col-sm-6">
            <div className="text-danger">{"Rank #" + this.props.index}</div>
            <h2 className="text-capitalize font-weight-light text-danger">
              {this.props.contestantname}
            </h2>
          </div>
          <div className="col-sm-4 mt-2">
            <div className="text-danger">Final Rating</div>
            <h1 className="text-danger">{this.props.rating} %</h1>
          </div>
        </div>
        <div id={"judgesContainer" + this.props.id} className="row" />
      </div>
    );
  }
}

class FilterJudges extends React.Component {
  componentDidMount() {
    getRatings(this.props.contestantid, this.props.id);
    var contestantid = this.props.contestantid;
    var judgeid = this.props.id;
    firebase
      .database()
      .ref()
      .on("child_changed", function(dataSnapshot) {
        getRatings(contestantid, judgeid);
      });
    firebase
      .database()
      .ref()
      .on("child_added", function(dataSnapshot) {
        getRatings(contestantid, judgeid);
      });
  }
  render() {
    return (
      <div className="mt-3">
        <div className="row w-75" />
        <small className="text-info">Criteria</small>
        <div
          id={"criteriaRatings" + this.props.contestantid + this.props.id}
          className="row"
        />
      </div>
    );
  }
}
