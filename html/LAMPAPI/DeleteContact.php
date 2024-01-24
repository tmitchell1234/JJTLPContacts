<?php
	$inData = getRequestInfo();
	
    $phoneNumber = $inData["phoneNumber"];
    $emailAddress = $inData["emailAddress"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $createdByUserId = $inData["createdByUserId"];
    $friendshipLevel = $inData["friendshipLevel"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName=? AND LastName=? AND CreatedByUserID=? AND PhoneNumber=? AND EmailAddress=? AND FriendshipLevel=?");
        $stmt->bind_param("ssissi", $firstName, $lastName, $createdByUserId, $phoneNumber, $emailAddress, $friendshipLevel);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->fetch_assoc()){
            $stmt = $conn->prepare("DELETE from Contacts WHERE FirstName=? AND LastName=? AND CreatedByUserID=? AND PhoneNumber=? AND EmailAddress=? AND FriendshipLevel=?");
            $stmt->bind_param("ssissi", $firstName, $lastName, $createdByUserId, $phoneNumber, $emailAddress, $friendshipLevel);
            $stmt->execute();
            http_response_code(200);
            returnWithSuccess();
            $stmt->close();
		    $conn->close();
        }
        else{
            http_response_code(409);
            returnWithError("Contact does not exist");  
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
?>