<?php
	function db(){
		require_once("/home/L4721/db-hacknslash.php");
		return $db;
	}
	
	function updateCharacter(){
		try{
			require_once '/home/L4721/PasswordLib.phar';
			
			$db = db();
			
			if($_POST['characterName']){
				$characterName = $_POST['characterName'];
			}else{
				$characterName = "";
			}
			
			if($_POST['characterLevel']){
				$characterLevel = $_POST['characterLevel'];
			}else{
				$characterLevel = 0;
			}
			
			if($_POST['characterExperience']){
				$characterExperience = $_POST['characterExperience'];
			}else{
				$characterExperience = 0;
			}
			
			if($_POST['accountId']){
				$account = $_POST['accountId'];
			}else{
				$account = "";
			}
			
			$update = $db->prepare("UPDATE characters SET characterLevel=?, characterExperience=? WHERE characterName=? AND accountId=?");
			$update->execute(array($characterLevel, $characterExperience, $characterName, $account));
            
		}catch (PDOException $e){
			echo $e->getMessage();
			exit;
		}
		
	}
	
	updateCharacter();
?>