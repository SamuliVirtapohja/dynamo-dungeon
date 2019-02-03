<?php
	function db(){
		require_once("/home/L4721/db-hacknslash.php");
		return $db;
	}
	
	function login(){
		try{
			require_once '/home/L4721/PasswordLib.phar';
			
			$db = db();
			
			if($_POST['characterName']){
				$characterName = $_POST['characterName'];
			}else{
				$characterName = "";
			}
			
			$login = $db->prepare("SELECT characterLevel, characterExperience FROM characters WHERE characterName=?");
			$login->execute(array($characterName));
            
			while($row = $login->fetch(PDO::FETCH_ASSOC)){
                echo "{$row['characterLevel']} {$row['characterExperience']}";
            }
            
			
		}catch (PDOException $e){
			echo $e->getMessage();
			exit;
		}
		
	}
	
	login();
?>