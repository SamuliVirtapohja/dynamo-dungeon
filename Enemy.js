#pragma strict


private var player: Transform;
var playerHealth: CharacterControl;

private var MoveSpeed = 6;
private var MaxDist = 25;
private var MinDist = 5;
private var timer : float;
var timeBetweenAttacks : float = 2f;

// vihollisen arvoja
var health: float = 20;
var experience: System.Int32 = 20;

var ability: GameObject;

private var enemyControl: GameObject;
private var enemyManager: EnemyManager;

function Start () {
	player = GameObject.FindGameObjectWithTag("Player").transform; // hakee pelaajan asiat
	playerHealth = player.GetComponent(CharacterControl);

	enemyControl = GameObject.FindWithTag("enemymanager");// hakee enemymanagerin
	enemyManager = enemyControl.GetComponent(EnemyManager);
}

function Update () {
	if(health <= 0){// kuolema

		// lisätään globaaleihin muuttujiin
		ApplicationModel.characterExp += experience;
		ApplicationModel.expGained += experience;
		ApplicationModel.enemiesKilled++;
		if(player != null){
			playerHealth.SendMessage("updateUI");// päivittää ui:n
		}

		enemyManager.enemyDied();// lähettää managerille viestin vihollisen kuolemasta

		Destroy(gameObject);// tuhoaa kyseisen vihollisen
	}

	if(player != null){// jos pelaaja on olemassa
		timer += Time.deltaTime;// lyönnin ajastin
		if(Vector3.Distance(transform.position,player.position) <= MaxDist){// pelaaja tarpeeksi lähellä
			transform.LookAt(player);// kohdistaa pelaajaa kohti
			transform.position += transform.forward * MoveSpeed * Time.deltaTime;// liikkuu pelaajaa kohti
			if(Vector3.Distance(transform.position,player.position) <= MinDist){// jos on tarpeeksi lähellä ja kykenee lyömään
				if(timer >= timeBetweenAttacks){
					Attack();
				}
			}
		}
	}
}

function Attack(){// lyönti
	timer = 0f;// nollataan lyönnin ajastin
	if(playerHealth.health > 0){
		playerHealth.TakeDamage(10);// pelaaja ottaa läpyskää
	}
	
}

function TakeDamage(amount : int){// abilityn osuessa otetaan damagea
	health -= amount;
}


