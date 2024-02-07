<?php
	$inData = getRequestInfo();
	
    $phoneNumber = $inData["phoneNumber"];
    $emailAddress = $inData["emailAddress"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $createdByUserId = $inData["createdByUserId"];
    $insertionAmount = $inData["insertionAmount"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $newLastName = $lastName;
		for ($i = 1; $i <= $insertionAmount; $i++){
			if($i != 1){
				$newLastName = $lastName . " " . strval( $i );
			}else{
				$newLastName = $lastName;
			}
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName=? AND LastName=? AND CreatedByUserID=? AND PhoneNumber=? AND EmailAddress=?");
            $stmt->bind_param("ssiss", $firstName, $newLastName, $createdByUserId, $phoneNumber, $emailAddress);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->fetch_assoc()){
                //http_response_code(409);
                //returnWithError("Contact is already created");
            }
            else{
				
				$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, CreatedByUserID, PhoneNumber, EmailAddress) VALUES(?,?,?,?,?)");
                $stmt->bind_param("ssiss", $firstName, $newLastName, $createdByUserId, $phoneNumber, $emailAddress);
                $stmt->execute();
            }

        	updateFriendshipLevel($conn, $firstName, $newLastName, $phoneNumber, $emailAddress);
        }
        
        returnWithSuccess();

		$stmt->close();
		$conn->close();
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