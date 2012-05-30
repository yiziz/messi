<?php


$to = "info@sistributome.org";
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
$xml = new SimpleXMLElement($xml);

$sXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
$sXml = htmlentities($sXml) . "<br />";
$sXml .= "&lt;" . $xml->getName() ;
foreach($xml->attributes() as $a => $b) {
	$sXml .= " ";
	$sXml .= $a . '="' . $b .'"';
}
$sXml .= "&gt;" . "<br />";
$f2 = false;
$f3 = false;
function indx ($xml, $indent) {
	global $f2, $f3;
	$temp = "";
	foreach ($xml->children() as $x) {
		$spaces = str_repeat("&nbsp;", 4*$indent);
		if ($indent == 2 && !$f2) {
			$temp .= str_repeat("&nbsp;", 4) . "&lt;" . $x->getName();
			$f2 = true;
		} else if($indent == 3 && !$f3){
			$temp .= str_repeat("&nbsp;", 4) . "&lt;" . $x->getName();
			$f3 = true;
		} else {
			$temp .= $spaces . "&lt;" . $x->getName() ;
		}
		foreach($x->attributes() as $a => $b) {
			$temp .= " ";
			$temp .= $a . '="' . $b .'"';
		}
		$temp .= "&gt;" . "<br />" . $spaces;
		if (trim($x) != "") {
			$temp .= $spaces . $x . "<br />";
		}
		$temp .= indx($x, $indent+1);
		$temp .= $spaces . "&lt;/" . $x->getName() . "&gt;<br />";
	}
	return $temp;
}

$sXml .= indx($xml, 1);
$sXml .= "&lt;/" . $xml->getName() . "&gt;<br />";
$xml = str_replace("<br /><br />", "<br />", $sXml);
//echo $xml;
//$xml = $xml->asXML();
//$xml = htmlentities($xml);


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
			
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";
$headers .= "From: $name <$email>" . "\r\n";
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

if(mail($to, $subject, $message, $headers)) {
	echo("<div id=\"emailed\" >Submittion Sent to $to</div><br />");
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