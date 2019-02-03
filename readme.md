# Dynamo Dungeon

## Tekijät

* Samuli Virtapohja - L4721
* Mikko Martikainen - K8936

## Johdanto

Projekti tehtiin kursseille web-ohjelmointi TTMS0500 sekä web-palvelinohjelmointi TTMS0900.
Projekti on peli, jossa pelaaja voi kirjautua sekä rekisteröityä järjestelmään, luoda hahmoja, pelata peliä ja hahmon tulokset tallentuvat tietokantaan.

Projektin teon aikana käytimme Unityn omaa collaborate toimintoa, jossa unity projektin voi jakaa toisille unityn käyttäjille.

Repository sisältää skriptejä kielillä C#, Javascript, PHP sekä mysql tietokannan luomiseen mahdollistavan .mwb-tiedoston. Repository ei sisällä Unityn scene tiedostoja eikä Unityn prefabbeja (esim. jotkin asiat joudutaan lisäämään Unityn inspectorissa kuten pelaajan prefab)

Linkki buildattuun projektiin: [Dynamo Dungeon](https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/)

Default template näytti kamalalta joten otimme unitylle kolmannen osapuolen [webgl templaten](https://github.com/greggman/better-unity-webgl-template)

### Kehityksen alkuvaihe

Lähtötilanteessa ongelmina olivat yhteyden otto tietokantaan ja se miten tieto saadaan välitettyä takaisin Unityyn. Päädyimme toteuttamaan AJAX menetelmällä formin lähettämistä php scriptille ja php scripti echoaa tiettyjen ehtojen täyttyessä halutut asiat.

Kentän luonnissa aloimme tosiaan kääntämään C# koodia Javascriptiin, mutta siitä lisää myöhemmin.

Kehityksen alkuvaiheessa vihollisten ja pelaajan logiikat tapahtuivat erillisessä kentässä. Vasta myöhemmin lisäsimme automaattisesti pelaajan ja viholliset kenttään omille paikoilleen.

## Javascript

### Käyttöliittymäohjelmointi

Käyttöliittymän luonti toteutettiin unityn omalla editorilla sekä luomalla objectejä scripteissä. Objectien toiminnalisuus (Buttonien klikkaus, inputfieldien arvot) sekä 
vittaukset objecteihin liitettiin scipteihin, joista niitä pystyttiin hallitsemaan. Käyttöliittymän responsiivisuus toteutettiin näyttämällä/piilottamalla/luomalla objecteja sekä muuttamalla
niiden sisältämiä komponentteja tietokannasta saadun tiedon mukaan.

Esimerkit: 

Listan nimien muuttaminen objecteiksi

```
if (ApplicationModel.characters.length >= 1) {

    for (var i: System.Int32 = 0; i < ApplicationModel.characters.length; i++) {

        // Luodaan uusi button referenssiobjectista
        var button: GameObject = GameObject.Instantiate(prefab);
        
        // Asetetaan objectille vanhempi johon se liitetään 
        button.transform.SetParent(panelToAttachTo.transform);
        
        // Asetetaan objectin nimeksi tietokannasta haettu nimi
        button.name = ApplicationModel.characters[i].ToString();
        
        // Haetaan GameObjectin tekstikomponentti ja asetetaan myös sen arvoksi tietokannasta saatu hahmon nimi
        button.transform.GetChild(0).GetComponent(Text).text = ApplicationModel.characters[i].ToString();
        
        // Haetaan GameObjectin Button komponentti ja lisätään siihen tapahtumankuuntelija
        button.GetComponent(Button).onClick.AddListener(ShowCharacterInfo);
    }
}
```

Objectien piilotus/näyttäminen ja tiedon hakeminen EventSystemistä. 

```
public function ShowCharacterInfo() {
    
    // Suljetaan muut paneelit näytöltä ja asetetaan infon näyttävä paneeli aktiiviseksi
    newCharPanel.SetActive(false);
    deletePanel.SetActive(false);
    charInfo.SetActive(true);
    
    // Haetaan eventsystemistä klikatun objectin nimi ja tallennetaan se muuttujaan
    charName.text = EventSystem.current.currentSelectedGameObject.name;

    // Kutsutaan funktiota joka hakee tietokannasta tietoja klikatun muuttujan arvon avulla
    CharacterStatRequest();
}
```

### Javascript Unityssä

Kaikki scriptit Unityssä perivät luokan MonoBehaviour tai käyttävät sen funktioita sekä ominaisuuksia.

Projektissa käytetyt MonoBehaviour-luokalta perityt ominaisuudet ja funktiot.

| Käytetty | Määrittely |
| ------ | --------- |
| Start | Kutsutaan kun sillä hetkellä kun kyseinen scripti aktivoituu, ennen Update-funktion ensimmäistä kutsua // vaihtoehtona olisi Awake |
| Update | Kutsutaan jokaisen kuvan piirrolla // vaihtoehtona olisi FixedUpdate |
| SendMessage | Kutsuu määriteltyä funktiota kyseisellä peliobjektilla |
| OnDestroy | Kyseisen peliobjektin tuhoutuessa kutsutaan tätä funktiota |
| OnTriggerEnter | Kutsutaan kun peliobjekti osuu toiseen peliobjektiin |
| Destroy | Tuhoaa määritellyn GameObjectin |
| Instantiate | Kloonaa peliobjektin, useimmin peliobjekti määritellään inspectorissa |
| GameObject | Viittaus peliobjektiin // gameObject taas on viittaus scriptin instanssiin |
| GetComponent | Viittaus peliobjektin komponenttiin // esim. toinen scripti |
| Tag | Viittaus peliobjectin tagiin// tageja on mahdollista luoda ja määritellä inspectorissa, niiden tarkoitus on helpottaa scriptaamista |
| Application.LoadLevel | Lataa buildissa olevan scenen nimen tai numeron perusteella |
| Rigidbody | Ohjaa peliobjektia fysiikkamoottorin avulla |
| Transform | Peliobjektin paikka, pyöriminen sekä suuruus |
| Vector3 | 3d vektorit ja pisteet xyz-asteikolla // forward=(0,0,1), back=(0,0,-1), left=(-1,0,0), right=(1,0,0) |
| Quaternion | Edustaa pyörimistä // .identity kertoo pelimoottorille ettei pyörimistä ole |
| WWWForm | Luo form dataa postattavaksi web-palvelimille |
| WWW | Yksinkertainen tapa päästä käsiksi web-sivuun |
| yield | odottaa vastausta |
| EventSystem| Hallitsee tapahtumien lähettämistä objecteille käyttäjän syötteen perusteella |


Kun kenttä on luotu, scripti lähettää Spawn pyynnön EnemyManager-peliobjektille, jonka aikana kenttään lisätään pelaaja sekä viholliset.

```
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
```

Pelin aikana globaalisti tarvittavat muuttujat tallennettiin ApplicationModel-luokan ominaisuuksiin, jolloin kaikki sciptit pääsivät näihin käsiksi. 

### PHP

PHP scriptit projektissa ottavat formilta dataa sekä käsittelevät tietokantaa. Salasanat hashataan PasswordLib.phar avulla, koska studentin php versio on vanha. [Linkki kyseiseen repoon](https://github.com/ircmaxell/PHP-PasswordLib)

Tietokannan käsittelyssä käytimme PDO:ta.

Esimerkki login scriptistä

Kyseiselle skriptille lähetetään formina accountin nimi sekä salasana. Muuttujat käsitellään halutulla tavalla ja echotaan tiedot, jotka palautetaan Unityyn.

```
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

```

### C#

Kentän luonti on otettu Unityn omista tutoriaaleista muutamalla muutoksella.
[Linkki tutoriaaliin](https://unity3d.com/learn/tutorials/s/procedural-cave-generation-tutorial)

Yritimme kääntää kyseistä scriptiä JS muotoon, mutta ongelmaksi tuli C# syntaksin `params` -komento. Params kertoo funktiolle, että kyseinen funktio saa x-määrän y-muuttujia sisäänsä ja Javascriptin syntaksissa ei ole kyseistä vastinetta.
[MS Docs - params](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/params)
Koitimme luoda erillistä luokkaa Javascriptillä, mutta emme saaneet kunnollisia tuloksia, joten käytimme tutoriaalin C#-scriptiä.

Muutoksia teimme MapGenerator.cs tiedostoon, johon lisäsimme void InsertEnemies() metodin luomaan kenttään spawnpoint peliobjekteja.

```
	void InsertEnemies(List<Coord> region){ // ottaa sisään jääneet huoneet
		int coordCount = 0;
		foreach (Coord coord in region) { 
			coordCount++;
			if (coordCount % 250 == 0) {// jakojäännös 250 niin luodaan spawnpoint
				Vector3 pos = CoordToWorldPoint (coord);
				spawnPoint.transform.position = pos;
				Instantiate (spawnPoint);
			}
		}	
	}
```

## Jatkokehitys

* Vihollisille lisäkehitystä (tulevat seinistä läpi)
* [Javascript ollaan aikeissa deprecatemassa](https://blogs.unity3d.com/2017/08/11/unityscripts-long-ride-off-into-the-sunset/)

## Muut mietteet

* Projekti oli laaja joten olimme vaihe vaiheelta keskustelemassa ja toteuttamassa asioita samaan aikaan. 
* Uuteen työkaluun tutustuminen sekä pelimoottorin ominaisuuksien opettelu oli paikoittain vaativaa ja vei paljon aikaa.
* Haastava etsiä tietoa, koska JS-support häviämässä
* Opettavainen kokemus
* Arvosanaehdotus 4
