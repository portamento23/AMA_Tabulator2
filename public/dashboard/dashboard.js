function renderDashboard() {
  ReactDOM.render(
    <div>
      <SideNav
        ficon="grid"
        cname="sideNav-menus-font nav-link custom-active"
        lname={dashboard}
      />
      <SideNav
        ficon="layers"
        cname="sideNav-menus-font nav-link "
        lname={contest}
        eventc={e => renderTabulation()}
      />
    </div>,
    sidenNaveElement
  );
  ReactDOM.render(<MainDashboard />, mainElement);
}

class MainDashboard extends React.Component {
  componentDidMount() {
    getContestList();
  }
  render() {
    return (
      <div className="container mt-5">
        <h1>Dashboard</h1>
        <div id="constestList" className="accordion mt-5" />
      </div>
    );
  }
}

class ContestList extends React.Component {
  viewDetails() {
    var win = window.open("details.html?eventid=" + this.props.id, "_blank");
    win.focus();
  }
  announceResult() {
    var win = window.open("result.html?eventid=" + this.props.id, "_blank");
    win.focus();
  }
  componentDidMount() {
    getCotestants(this.props.id);
    var id = this.props.id;
    firebase
      .database()
      .ref()
      .on("child_changed", function(data) {
        getCotestants(id);
      });
  }
  render() {
    return (
      <div className="card mt-5 border-0">
        <div className="card-header border-0" id="headingOne">
          <div
            className="btn-link w-100"
            data-toggle="collapse"
            data-target={"#collapseOne" + this.props.id}
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <div className="row">
              <div className="col">
                <h2 className="text-primary">{this.props.eventname}</h2>
              </div>
              <div className="col">
                <button
                  type="button"
                  onClick={this.viewDetails.bind(this)}
                  class="btn btn-outline-info m-1"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={this.announceResult.bind(this)}
                  class="btn btn-outline-info m-1"
                >
                  Announce Results
                </button>
              </div>
              
            </div>
          </div>
        </div>
        <div
          id={"collapseOne" + this.props.id}
          className="collapse border-0"
          aria-labelledby="headingOne"
          data-parent="#accordion"
        >
          <div
            className="card-body border-0 bg-light"
            id={"contestBody" + this.props.id}
          />
        </div>
      </div>
    );
  }
}

class ResultsContestantList extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <div className="row border-bottom m-2 rounded">
        <div className="col">
          <h1 className="text-dark text-capitalize font-weight-light">
            {this.props.contestantname}
          </h1>
        </div>
        <div className="col p-1">
          <div id={"totalRating" + this.props.id}>
            <h3>{isNaN(this.props.rating)?"No Rating":this.props.rating+"%"}</h3>
          </div>
        </div>
      </div>
    );
  }
}

class RatingResultsOnContestant extends React.Component {
  render() {
    return <div className="row">{this.props.rating}</div>;
  }
}

function getContestList() {
  var contestListContainer = document.getElementById("constestList");
  var contestObjects = [];
  firebase
    .database()
    .ref("events")
    .once("value", function(dataSnapshot) {
      dataSnapshot.forEach(function(childsnapshot) {
        contestObjects.push(childsnapshot.val());
      });
      contestObjects.reverse();
      var listItem = contestObjects.map(objects => (
        <ContestList
          key={objects.key}
          eventname={objects.eventname}
          id={objects.key}
        />
      ));
      ReactDOM.render(<div>{listItem}</div>, contestListContainer);
    });
}

function getCotestants(id) {
  var contestantsContainer = document.getElementById("contestBody" + id);
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
            rating.rate = total / judgeNumber;
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

            var listItem = resultsFinalObjects.map(objects => (
              <ResultsContestantList
                key={objects.contestantId}
                id={objects.contestantId}
                contestantname={objects.contestantname}
                rating={Math.round(objects.rate * 100) / 100}
              />
            ));

            ReactDOM.render(<div>{listItem}</div>, contestantsContainer);
          });
      });
    });
}

renderDashboard();
