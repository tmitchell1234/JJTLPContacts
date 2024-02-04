<?php
	$inData = getRequestInfo();
	
    $phoneNumber = $inData["phoneNumber"];
    $emailAddress = $inData["emailAddress"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $createdByUserId = $inData["createdByUserId"];
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName=? AND LastName=? AND CreatedByUserID=? AND PhoneNumber=? AND EmailAddress=?");
        $stmt->bind_param("ssiss", $firstName, $lastName, $createdByUserId, $phoneNumber, $emailAddress);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->fetch_assoc()){
            $stmt = $conn->prepare("DELETE from Contacts WHERE FirstName=? AND LastName=? AND CreatedByUserID=? AND PhoneNumber=? AND EmailAddress=?");
            $stmt->bind_param("ssissi", $firstName, $lastName, $createdByUserId, $phoneNumber, $emailAddress);
            $stmt->execute();
            http_response_code(200);
            updateFriendshipLevel($conn, $firstName, $lastName, $phoneNumber, $emailAddress);
            returnWithSuccess();
            $stmt->close();
		    $conn->close();
        }
        else{
            http_response_code(409);
            returnWithError("Contact does not exist");  
        }
        
	}

    function updateFriendshipLevel($conn, $firstName, $lastName, $phoneNumber, $emailAddress)
	{
		$stmt = $conn->prepare("SELECT count(*) as NewLevel FROM Contacts WHERE FirstName=? AND LastName=? AND PhoneNumber=? AND EmailAddress=?");
		$stmt->bind_param("ssss", $firstName, $lastName, $phoneNumber, $emailAddress);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($row = $result->fetch_assoc()){
			$stmt = $conn->prepare("UPDATE Contacts SET FriendshipLevel=? WHERE FirstName=? AND LastName=? AND PhoneNumber=? AND EmailAddress=?");
			$stmt->bind_param("issss", $row['NewLevel'], $firstName, $lastName, $phoneNumber, $emailAddress);
			$stmt->execute();
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