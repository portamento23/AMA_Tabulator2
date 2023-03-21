
var urlParams = new URLSearchParams(window.location.search);
//console.log(urlParams.get('eventid'));

var event_id = urlParams.get('eventid');

function getLogs(){
  firebase.database().ref("candidates").child(event_id).once('value', function (snapshot) {
    snapshot.forEach(function (childsnapshot) {
      // candidateObjects.push(childsnapshot.val());

      console.log(childsnapshot.val().contestantname);
      firebase.database().ref("judges").child(event_id).once('value', function (judgeSnap) {
          judgeSnap.forEach(function (judgeChildsnapshot){
            console.log(judgeChildsnapshot.val().judgeName);
            firebase.database().ref("ratings").child("event"+event_id)
            .child("contestant"+childsnapshot.val().contestantid)
            .child("judge"+judgeChildsnapshot.val().judgeId).once('value',function (ratingSnap){
              ratingSnap.forEach(function (ratingChildSnapShot){
                firebase.database().ref("criteria").child(event_id).child(ratingChildSnapShot.val().criteriaId).once('value',function(criteriaSnap){
                  console.log(childsnapshot.val().contestantname+"=>"+judgeChildsnapshot.val().judgeName+"=>"+criteriaSnap.val().criteriaName+"=>"+ratingChildSnapShot.val().rating);
                });
              });
            });
          });
        });
    });

  });
}


function getResults(){
  var tableJudgesObjects = [];
  var container = document.getElementById("tableContainer");
  firebase.database().ref("judges").child(event_id).once('value',function (judgeSnapshot){
    judgeSnapshot.forEach(function(judgeChildSnapShot){
      tableJudgesObjects.push(judgeChildSnapShot.val());
      //console.log(judgeChildSnapShot.val());
    });
    var listJudge  = tableJudgesObjects.map((objects)=>
    <JudgeTable key = {objects.judgeId} judgeId ={objects.judgeId} judgeName  = {objects.judgeName}/>
    );
    ReactDOM.render(
      <div className = "mt-5">
      {listJudge}</div>,container
    );
  });
}
getResults();


class JudgeTable extends React.Component{
  componentDidMount(){
    var contestantsObjects = [];
    var judgeId = this.props.judgeId;

    var contestantContainer =document.getElementById("contestantContainer"+judgeId);
    firebase.database().ref("candidates").child(event_id).once('value',function(contestantSnapshot){
      contestantSnapshot.forEach(function(contestantChildSnapshot){
        contestantsObjects.push(contestantChildSnapshot.val());

      });
      var listItem  = contestantsObjects.map((objects)=>
        <Contestants contestantid ={objects.contestantid} key = {objects.contestantid} judgeId = {judgeId} contestantName = {objects.contestantname}/>
      );
      ReactDOM.render(
        <div className = "row w-100">
          {listItem}
        </div>,contestantContainer
      );
    });
  }
  render(){
    return(
      <div className = "row mt-5">
        {this.props.judgeName}
        <div id = {"contestantContainer"+this.props.judgeId} className = "row w-100">

        </div>
        <div className ="row" id={"results"+this.props.judgeId}>

        </div>
      </div>
    );
  }
}

class Contestants extends React.Component{
  componentDidMount(){
    var judgeId = this.props.judgeId;
    var contestantid = this.props.contestantid;
    var criteriaObjects = [];
    var totalResultsContainer = document.getElementById("totalResults"+contestantid+judgeId);
    var container = document.getElementById("rateContainer"+contestantid);
    console.log("test: event"+event_id+"contestant"+contestantid+"judge"+judgeId);
    firebase.database().ref("resultTotal").child("event"+event_id).child("contestant"+contestantid).child("judge"+judgeId).once('value', function(resultsSnapshot){
      console.log(resultsSnapshot.val());
      ReactDOM.render("Total Results"+resultsSnapshot.val().totalRating+" %",totalResultsContainer);
    });
    firebase.database().ref("criteria").child(event_id).once('value', function(criteriaSnapshot){
      criteriaSnapshot.forEach(function(criteriaChildSnapshot){
        criteriaObjects.push(criteriaChildSnapshot.val());
      });
      var listItem = criteriaObjects.map((objects)=>
        <Criteria key = {objects.criteriaId}
          criteriaId ={objects.criteriaKey}
          criteriaPercent = {objects.criteriaPercentage}
          contestantid = {contestantid}
          judgeId ={judgeId}
          criteriaName= {objects.criteriaName}/>
      );

      ReactDOM.render(
        <div>
          {listItem}
        </div>,container
      );
    });
  }
  render(){
    return(
      <div className="col-3 mt-3">
        {this.props.contestantName}
        <div className="row" id = {"rateContainer"+this.props.contestantid}>

        </div>
        <div id = {"totalResults"+this.props.contestantid+this.props.judgeId} className ="row mt-3">

        </div>
      </div>
    );

  }
}

class Criteria extends React.Component{
  componentDidMount(){
    var contestantId  = this.props.contestantid;
    var criteriaId = this.props.criteriaId;
    var judgeId = this.props.judgeId;
    console.log("event id "+event_id+" contestant id "+this.props.contestantid+" judgeId "+this.props.judgeId+" criteria id"+ this.props.criteriaId);
  firebase.database().ref("ratings")
  .child("event"+event_id)
  .child("contestant"+this.props.contestantid)
  .child("judge"+this.props.judgeId)
  .child(this.props.criteriaId)
  .once('value',function (rateSnapshot){
    console.log(rateSnapshot.val().rating);
    ReactDOM.render(
      rateSnapshot.val().rating,document.getElementById("rateContainer"+judgeId+contestantId+criteriaId)
    );
  });
  }
  render(){
    return(
      <div className = "row">
        <div className = "col">

          {this.props.criteriaName}
        </div>
        {/* <div className ="col">
          {this.props.criteriaPercent} x
        </div> */}
        <div id={"rateContainer"+this.props.judgeId+this.props.contestantid+this.props.criteriaId} className ="col">

        </div>
      </div>
    );
  }
}
