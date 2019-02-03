#pragma strict

var health = 100;

private var playerstats: GameObject;
private var gameUI: Text;

function Start () {
	playerstats = GameObject.FindWithTag("playerstats");

	updateUI();
}

function Update () {
	if(health <= 0){
		Destroy(gameObject);
	}
}

function TakeDamage(amount : int){// pelaaja ottaa damagea
	health -= amount;
	updateUI();
	if(health <= 0){
		health = 0;
		Application.LoadLevel("score");
	}
}



function OnDestroy(){// kun kuolee ladataan score ja unlockataan hiiri
	Cursor.visible = true;
	Cursor.lockState = CursorLockMode.None;
}

function updateUI(){// päivittää hahmon tiedot ruutuun
	checkLevel(); // asettaa hahmon levelin oikeaksi
	gameUI = playerstats.GetComponent.<Text>();
	gameUI.text = "Health: " + health.ToString() 
	+ "\nLevel: " + ApplicationModel.characterLevel.ToString() 
	+ "\nExperience: " + ApplicationModel.characterExp.ToString();
}

function checkLevel(){
	ApplicationModel.characterLevel = ApplicationModel.characterExp / 100;
}

