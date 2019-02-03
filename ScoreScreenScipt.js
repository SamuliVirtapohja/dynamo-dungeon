#pragma strict

public var charName: Text;
public var killCount: Text;
public var expCount: Text;
public var levelCount: Text;

var updateStatsUrl = "https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/characterUpdate.php";

charName.text = ApplicationModel.characterName;
killCount.text = "Kills: " + ApplicationModel.enemiesKilled.ToString();
expCount.text = "Exp Gained: " + ApplicationModel.expGained.ToString();
levelCount.text = "Levels Gained: " + ApplicationModel.levelsGained.ToString();

// Lasketaan uudet ja vanhat tiedot yhteen ja tyhjätään laskurit
private var newTotalExp: System.Int32 = (ApplicationModel.characterExp + ApplicationModel.expGained);
private var newTotalLevel: System.Int32 = (ApplicationModel.characterLevel + ApplicationModel.levelsGained);

ApplicationModel.expGained = 0;
ApplicationModel.levelsGained = 0;

UpdateStats();

// Päivitetään uudet tiedot tietokantaan
function UpdateStats() {

    var form = new WWWForm();
    form.AddField("characterName", ApplicationModel.characterName);
    form.AddField("characterlevel", newTotalLevel);
    form.AddField("characterExperience", newTotalExp);
    form.AddField("accountId", ApplicationModel.account[0].ToString());

    var www = new WWW(updateStatsUrl, form);

    yield www;
    

    if (www.error == null) {
        Debug.Log("Update ok");
    }

    else {
        Debug.Log("WWW Error: " + www.error);
    }
}

// Käynnistetään peli uudelleen alusta
public function NewGame() {
    Application.LoadLevel("terrain generation");
}

// Siirrytään takaisin hahmonäkymään
public function BackToCharScreen() {
    Application.LoadLevel("char select");
}

// Siirrytään takaisin kirjautumisnäkymään
public function Logout() {

    ApplicationModel.account = null;
    ApplicationModel.characters = null;

    Application.LoadLevel("Login");
}