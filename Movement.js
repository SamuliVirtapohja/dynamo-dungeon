#pragma strict

// abilityjen muuttujia
public var ability: Rigidbody;
public var abilityStart: Transform;


// liikkumisen ja kameran muuttujia
private var x: float;
private var y: float;
private var speed: float = 0.05;
private var rotateValue: Vector3;

private var gamemenu: GameObject;

private var pause: boolean = false;

function Start () {
	gamemenu = GameObject.FindWithTag("gamemenu");
	gamemenu.SetActive(false);

	LockMouse();

}


function Update () {

	if(Input.GetKeyDown(KeyCode.Escape)){// escape ohjaa pause booleania
		GameMenu();
	}

	if(pause){// pysäyttää ajan kulun tai jatkaa sen kulkua
		Time.timeScale = 0;
	}else{
		 if(Input.GetMouseButtonDown(0)){// ammutaan
	    	var abilityInstance: Rigidbody;

	    	abilityInstance = Instantiate(ability, abilityStart.position + Vector3 (0, 0, -1) , abilityStart.rotation);
	    	abilityInstance.AddForce(abilityStart.forward * 1000);
    	} 

		rotateCamera();
		characterMovement();
		Time.timeScale = 1;
	}
}

function rotateCamera(){ // kameran kääntäminen
	y = Input.GetAxis("Mouse X");
	x = Input.GetAxis("Mouse Y");

	rotateValue = new Vector3(x, y * -1, 0);
	transform.eulerAngles = transform.eulerAngles - rotateValue;
}


function characterMovement(){// hahmon liikkuminen

	if(Input.GetKey("w")){
		this.transform.Translate(Vector3.forward * speed);
	}
	if(Input.GetKey("s")){
		this.transform.Translate(Vector3.back * speed);
	}
	if(Input.GetKey("d")){
		this.transform.Translate(Vector3.right * speed);
	}
	if(Input.GetKey("a")){
		this.transform.Translate(Vector3.left * speed);
	}
}

function GameMenu(){// pelin menu
	if(pause){
		LockMouse();
		gamemenu.SetActive(false);
		pause = false;
	}else{
		ReleaseMouse();
		gamemenu.SetActive(true);
		pause = true;
	}
}


public function GoToScore(){// kentän vaihto
	Application.LoadLevel("score");
}

function LockMouse() {
	// hiiren lukitus
	Cursor.visible = false;
	Cursor.lockState = CursorLockMode.Confined;
	Cursor.lockState = CursorLockMode.Locked;
}

function ReleaseMouse() {
	// hiiren vapautus
	Cursor.visible = true;
	Cursor.lockState = CursorLockMode.None;
}