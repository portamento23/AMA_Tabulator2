<?php

$con = new mysqli("localhost","root","","ijudge");

if ($con -> connect_error) {
  // code...
  echo $con->connect_error;
}

?>
