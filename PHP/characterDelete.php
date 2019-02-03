<?php
	function db(){
		require_once("/home/L4721/db-hacknslash.php");
		return $db;
	}
	
	function createDelete(){
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
			
			$delete = $db->prepare("DELETE FROM characters WHERE characterName=? AND accountId=?");
			$delete->execute(array($characterName, $account));
            
		}catch (PDOException $e){
			echo $e->getMessage();
			exit;
		}
		
	}
	
	createDelete();
?>