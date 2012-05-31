<?php

// set email to address
$to = "info@sistributome.org";

// set variables from POST
// htmlentities to escape dangerous tags
$copy = "false";
if(isset($_POST['copy'])) {
	$copy = $_POST['copy'];
}
$name = "";
if(isset($_POST['name'])) {
	$name = $_POST['name'];
}
$name = htmlentities($name);
$type = ucwords($_POST['type']);
$node = $_POST['node'];
$xml = $_POST['xml'];

// create xml document from $xml
$xml = new SimpleXMLElement($xml);

// store xml into pretty formatted string
$sXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
$sXml = htmlentities($sXml) . "<br />";
$sXml .= "&lt;" . $xml->getName() ;
foreach($xml->attributes() as $a => $b) {
	$sXml .= " ";
	$sXml .= $a . '=&quot;' . $b .'&quot;';
}
$sXml .= "&gt;" . "<br />";
function indx ($xml, $indent) {
	$temp = "";
	foreach ($xml->children() as $x) {
		$spaces = str_repeat("&nbsp;", 8*$indent);
		$temp .= $spaces . "&lt;" . $x->getName() ;
		foreach($x->attributes() as $a => $b) {
			$temp .= " ";
			$temp .= $a . '=&quot;' . $b .'&quot;';
		}
		$temp .= "&gt;" . "<br />";
		if (trim($x) != "") {
			$temp .= $spaces . str_repeat("&nbsp;", 8) . $x . "<br />";
		}
		$temp .= indx($x, $indent+1);
		$temp .= $spaces . "&lt;/" . $x->getName() . "&gt;<br />";
	}
	return $temp;
}

$sXml .= indx($xml, 1);
$sXml .= "&lt;/" . $xml->getName() . "&gt;<br />";
$xml = str_replace("<br /><br />", "<br />", $sXml);

// format email
$email = "";
if(isset($_POST['email'])) {
	$email = $_POST['email'];
}
$email = htmlentities($email);
$subject = "[socr] Distributome XML - $type $node";
$message = "
			$type - $node <br />
			Submitted by $name <br />
			Email: $email <br />
			<br />
			$xml
			";

// set headers			
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";
$headers .= "From: $name <$email>" . "\r\n";

// add CC if user wanted a copy of the email
if ($copy == "true") {
	$headers .= "CC: $email";
}

echo("
	<html>
	<head>
		<title>Email Response</title>
		<link href=\"email.css\" rel=\"stylesheet\" type=\"text/css\">
	</head>
	<body>
	
");

// sent email and echo response text
if(mail($to, $subject, $message, $headers)) {
	echo("<div id=\"emailed\" >Submission sent to $to</div><br />");
	if($copy == "true") {
		echo("<div id=\"emailedCopy\" >A copy has been sent to $email</div>");
	}
} else {
	echo("<div id=\"emailed\" >Email Error. Please try again.</div>");
}
echo("
	</body>
	</html>
	
");




?>