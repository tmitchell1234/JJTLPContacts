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
            http_response_code(409);
            returnWithError("Contact is already created");
        }
		else{
			$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, CreatedByUserID, PhoneNumber, EmailAddress, FriendshipLevel) VALUES(?,?,?,?,?,?)");
        	$stmt->bind_param("ssissi", $firstName, $lastName, $createdByUserId, $phoneNumber, $emailAddress, $friendshipLevel);
        	$stmt->execute();
        	http_response_code(200);
        	returnWithSuccess();
			updateFriendshipLevel($conn, $firstName, $lastName, $phoneNumber, $emailAddress);
        	$stmt->close();
			$conn->close();
		}
		
	}

	function updateFriendshipLevel($conn, $firstName, $lastName, $phoneNumber, $emailAddress)
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FriendShipLevel=(sum(if(FirstName=? AND LastName=? AND PhoneNumber=? AND EmailAddress=?, 1, 0))) group by CreatedByUserID");
		$stmt->bind_param("", $firstName, $lastName, $phoneNumber, $emailAddress);
		$stmt->execute();
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