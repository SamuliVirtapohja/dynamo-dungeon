#pragma strict


var dmg: float = 2;


function Start () {
	Destroy(gameObject, 1f);// tuhotaan kyseinen instanssi peliobjektista
}

function Update(){
	
}


function OnTriggerEnter(hit:Collider){// kun osutaan 
	if(hit.tag == "Enemy"){// jos on Enemy-tägin alla, lähetetään viesti että ottaa sitä hyvää
		hit.transform.SendMessage("TakeDamage", dmg);
		Destroy(gameObject);
	}
}



