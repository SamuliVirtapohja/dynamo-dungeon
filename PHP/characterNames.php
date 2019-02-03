<?php
	function db(){
		require_once("/home/L4721/db-hacknslash.php");
		return $db;
	}
	
	function login(){
		try{
			require_once '/home/L4721/PasswordLib.phar';
			
			$db = db();
			
			if($_POST['account']){
				$account = $_POST['account'];
			}else{
				$account = "";
			}
			
			$login = $db->prepare("SELECT characterName FROM characters INNER JOIN account ON characters.accountId = account.accountId WHERE accountName=?");
			$login->execute(array($account));
            
			while($row = $login->fetch(PDO::FETCH_ASSOC)){
                echo "{$row['characterName']},";
            }
            
			
		}catch (PDOException $e){
			echo $e->getMessage();
			exit;
		}
		
	}
	
	login();
?>