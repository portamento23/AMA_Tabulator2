<?php

function getUsername($id){
  include 'connect.php';
  $sql = "select username from users where id = $id";
  $result = $con->query($sql);

  if ($result->num_rows>0) {
    // code...
    while ($row = $result->fetch_assoc()) {
      // code...
      return $row['username'];
    }
  }else {
    return "no name";
  }
}

?>
