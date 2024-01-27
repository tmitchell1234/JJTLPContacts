<?php
	$inData = getRequestInfo();
	
    $phoneNumber = $inData["phoneNumber"];
    $emailAddress = $inData["emailAddress"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $createdByUserId = $inData["createdByUserId"];
    $friendshipLevel = $inData["friendshipLevel"];
    $newNumber = $inData["newNumber"];
    $newAddress = $inData["newAddress"];
    $newFirstName = $inData["newFirstName"];
    $newLastName = $inData["newLastName"];
    $newFriendshipLevel = $inData["newFriendshipLevel"];
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
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, PhoneNumber=?, EmailAddress=?, FriendshipLevel=? WHERE FirstName=? AND LastName=? AND PhoneNumber=? AND EmailAddress=? AND FriendshipLevel=?");
            $stmt->bind_param("ssssissssi", $newFirstName, $newLastName, $newNumber, $newAddress, $newFriendshipLevel, $firstName, $lastName, $phoneNumber, $emailAddress, $friendshipLevel);
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