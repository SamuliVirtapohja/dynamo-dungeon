<?php
	function db(){
		require_once("/home/L4721/db-hacknslash.php");
		return $db;
	}
	
	function createCharacter(){
		try{
			require_once '/home/L4721/PasswordLib.phar';
			
			$db = db();
			
			if($_POST['characterName']){
				$characterName = $_POST['characterName'];
			}else{
				$characterName = "";
			}
			
			if($_POST['accountId']){
				$account = $_POST['accountId'];
			}else{
				$account = "";
			}
		
			$create = $db->prepare("INSERT INTO characters (characterName, characterLevel, characterExperience, accountId) VALUES (?, 0, 0, ?)");
			$create->execute(array($characterName, $account));
            
		}catch (PDOException $e){
			echo $e->getMessage();
			exit;
		}
		
	}
	
	createCharacter();
?>