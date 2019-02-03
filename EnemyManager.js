#pragma strict

var enemy: GameObject;
var player: GameObject;

public var enemyCount = 0;

private var spawnPoint : GameObject[];
private var playerspawned: boolean = false;

private var getPlayer: GameObject;

function Start(){
	getPlayer = GameObject.FindGameObjectWithTag("Player");
}

function Spawn(){
	spawnPoint = GameObject.FindGameObjectsWithTag("SpawnPoint");// hakee kaikki spawnpointit
	for(var spawn: GameObject in spawnPoint){// looppaa spawnpointit läpi ja luo viholliset
		var pos: Vector3;
		pos = spawn.transform.position;


		if(!playerspawned && spawn == spawnPoint[0]){// jos pelaajaa ei ole luotu
			Instantiate(player, pos, Quaternion.identity);
			playerspawned = true;
		}else{
			// kun pelaaja on luotu

			if(enemyCount < spawnPoint.Length){// lisätään vihollisia
				Instantiate(enemy, pos, Quaternion.identity);
				enemyCount++;
			}
			
		}			
	}
}

function enemyDied(){// kun vihollinen kuolee
	enemyCount--;
	if(enemyCount == 0 && getPlayer != null){// jos kaikki viholliset on kuolleita ladataan kenttä uudestaan
		Application.LoadLevel("terrain generation");
	}
}

