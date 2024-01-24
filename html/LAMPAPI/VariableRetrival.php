<?php

    #This code is only used to find the data types of certain variables in the sql database it should not be used
    #for anything on the website
    
    $inData = getRequestInfo();


	
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName=? AND LastName =?");
		$stmt->bind_param("ss", $inData["firstName"], $inData["lastName"]);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if( $row = $result->fetch_assoc()  )
		{
			foreach($row as &$type){
                sendResultInfoAsJson("\n");
                sendResultInfoAsJson($type ." ");
                sendResultInfoAsJson(gettype($type));
      }
		}
		else
		{
			returnWithError("No Records Found");
		}

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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    function returnWithSuccess ()
    {
        sendResultInfoAsJson('{"Success"}');
    }