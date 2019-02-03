<?php
	function db(){
		require_once("/home/L4721/db-hacknslash.php");
		return $db;
	}
	
	function register(){
		try{
			require_once '/home/L4721/PasswordLib.phar';
			
			$errmsg = "";
			
			
			$db = db();
			
			if(isset($_POST['account']) && $_POST['account'] != ""){
				$account = $_POST['account'];
				if(isset($_POST['password']) && $_POST['password'] != ""){
					$pass = $_POST['password'];
				}else{
					$errmsg = "Enter password";
					$pass = "";
				}
			}else{
				$errmsg = "Enter account name";
				$account = "";
			
			}
			
			if(isset($_POST['email'])){
					$email = $_POST['email'];
			}else{
				$email = "";
			}			
			
			if($errmsg == ""){				
				// salasanan hash
				$lib = new PasswordLib\PasswordLib();
				$hash = $lib->createPasswordHash($pass);
				
				$register = $db->prepare("INSERT INTO account (accountName, password, email, created) VALUES (?, ?, ?, NOW())");
				
				$register->bindValue(1, $account);
				$register->bindValue(2, $hash);
				$register->bindValue(3, $email);
				
				$register->execute();
			}else{
				echo $errmsg;
			}
			
		}catch (PDOException $e){
			echo $e->getMessage();
			exit;
		}
	}
	
	register();
?>