<?php

  $inData = getRequestInfo();
	$searchResults = "";
	$searchCount = 0;
	$search = "" . $inData["search"];
	$pageNumber = $inData["pageNumber"];
	$statement = "SELECT * FROM Contacts WHERE (";
		

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$searchList = explode(" ", $search);
		foreach ($searchList as $name){
			$statement .= "(FirstName LIKE '%" . $name . "%' OR LastName LIKE '%" . $name . "%' OR EmailAddress LIKE '%" . $name . "%' OR PhoneNumber LIKE '%" . $name . "%') AND ";
		}
		$statement = substr($statement,0,-4);
		$statement .= ") AND CreatedByUserID= " . $inData["createdByUserId"];


		$stmt = $conn->prepare($statement);
		//$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? ) AND CreatedByUserID=?");
    	//$searchName = "%" . $inData["search"] . "%";
    	//$stmt->bind_param("ssi", $searchName, $searchName, $inData["createdByUserId"]);
		$stmt->execute();

		$result = $stmt->get_result();

		$pageSize = 12;
		$rowsToGrab = $pageSize * ($pageNumber - 1);
		$rowNumber = 1;
		while($row = $result->fetch_assoc())
		{
			if(($rowsToGrab < $rowNumber) && ($rowNumber <= ($rowsToGrab + $pageSize))){
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;

				$searchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. '", "EmailAddress" : "' . $row["EmailAddress"]. '", "PhoneNumber" : "' . $row["PhoneNumber"]. '", "CreatedByUserID" : "' . $row["CreatedByUserID"].'", "ID" : "' . $row["ID"].'", "FriendshipLevel" : "' . $row["FriendshipLevel"]. '"}';
			}
			$rowNumber++;
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			$amountOfContacts = $result->num_rows;
			$searchResults = '{"AmountOfContacts" : "' . $amountOfContacts. '"},' . $searchResults;
			//returnwithInfo($amountOfContacts);
			returnWithInfo($searchResults);
			
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>