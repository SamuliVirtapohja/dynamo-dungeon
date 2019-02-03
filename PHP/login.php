<?php
	function db(){
		require_once("/home/L4721/db-hacknslash.php");
		return $db;
	}
	
	function login(){
		try{
			require_once '/home/L4721/PasswordLib.phar';
			
			$db = db();
			
			$errmsg = "";
			
			if(isset($_POST['account']) && $_POST['account'] != ""){
				$account = $_POST['account'];
				if(isset($_POST['password']) && $_POST['password'] != ""){
					
					$pass = $_POST['password'];
						// salasanan hash
					$lib = new PasswordLib\PasswordLib();
					
					
					$login = $db->prepare("SELECT * FROM account WHERE accountName=?");
					$login->execute(array($account));//, $hash

					if($errmsg == ""){
						while($row = $login->fetch(PDO::FETCH_ASSOC)){
							if($lib->verifyPasswordHash($pass, $row['password'])){
								echo "{$row['accountId']} {$row['accountName']}";
							}else{
								$errmsg = "Incorrect password";
							}
							
						}
					}else{
						echo $errmsg;				
					}

				}else{
					$errmsg = "Enter password";
					$pass = "";
				}
			}else{
				$errmsg = "Enter account name";
				$account = "";
			}
			
			
			if($errmsg != ""){
				echo $errmsg;
			}
			
		}catch (PDOException $e){
			echo $e->getMessage();
			exit;
		}
		
	}
	
	login();
?>