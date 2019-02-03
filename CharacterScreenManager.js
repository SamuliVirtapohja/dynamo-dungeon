#pragma strict
import UnityEngine.EventSystems;

public var prefab: GameObject;
public var panelToAttachTo: GameObject;
public var charInfo: GameObject;
public var loadingMsg: GameObject;
public var playBtn: GameObject;
public var deleteBtn: GameObject;
public var newCharPanel: GameObject;
public var warningMsg: GameObject;
public var deletePanel: GameObject;
public var deleteMsg: GameObject;

public var newCharName: InputField;
public var charName: Text;
public var charLevel: Text;
public var charExp: Text;

var characterStatsUrl = "https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/characterStats.php";
var newCharacterUrl = "https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/characterCreate.php";
var deleteUrl = "https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/characterDelete.php";
var charsUrl = "https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/characterNames.php";


// Käydään hahmojen nimet sisältävä taulukko läpi ja luodaan jokaiselle oma buttoni joiden avulla käyttäjä voi valita hahmon
if (ApplicationModel.characters.length >= 1) {

    for (var i: System.Int32 = 0; i < ApplicationModel.characters.length; i++) {

        // Luodaan uusi button referenssiobjectista, asetetaan se paneelin lapsiobjectiksi, muutetaan sen nimi sekä sisältö hahmon nimeä vastaavaksi ja lisätään tapahtumankuuntelija
        var button: GameObject = GameObject.Instantiate(prefab);
        button.transform.SetParent(panelToAttachTo.transform);
        button.name = ApplicationModel.characters[i].ToString();
        button.transform.GetChild(0).GetComponent(Text).text = ApplicationModel.characters[i].ToString();
        button.GetComponent(Button).onClick.AddListener(ShowCharacterInfo);
    }
}

// Tyhjentää käyttäjän tiedot globaaleista muuttujista ja ohjaa pelin kirjautumissivulle
public function Logout(){

    ApplicationModel.account = null;
    ApplicationModel.characters = null;

    Application.LoadLevel("Login");

}

public function StartGame() {
    Application.LoadLevel("terrain generation");
}

// Asetetaan hahmon tiedot esittävä paneeli aktiiviseksi ja haetaan siinä näytettävät tiedot
public function ShowCharacterInfo() {

    newCharPanel.SetActive(false);
    deletePanel.SetActive(false);
    charInfo.SetActive(true);
    charName.text = EventSystem.current.currentSelectedGameObject.name;

    CharacterStatRequest();
}

// Haetaan valitun hahmon tiedot tietokannasta ja liitetän ne hahmopaneeliin
function CharacterStatRequest() {

    var form = new WWWForm();
    form.AddField("characterName", charName.text);
    var www = new WWW(characterStatsUrl, form);

    yield www;

    if (www.error == null) {

        var separator: char[] = [" "[0]];
        var characterStats = www.text.Split(separator);

        ApplicationModel.characterName = charName.text;
        ApplicationModel.characterLevel = parseInt(characterStats[0]);
        ApplicationModel.characterExp = parseInt(characterStats[1]);

        loadingMsg.SetActive(false);

        charLevel.text = "Character Level: " + ApplicationModel.characterLevel.ToString();
        charExp.text = "Character exp: " + ApplicationModel.characterExp.ToString();

        deleteBtn.SetActive(true);
    }

    else {
        Debug.Log("WWW Error: " + www.error);
        loadingMsg.GetComponent(Text).text = "Error recieving character data.";
    }
}

// Näyttää / Piilottaa Uuden hahmon luomispaneelin
public function ToggleNewCharacterPanel() {

    if (newCharPanel.activeSelf) {

        newCharPanel.SetActive(false);
    }
    else {
        charInfo.SetActive(false);
        deletePanel.SetActive(false);
        deleteBtn.SetActive(false);
        newCharPanel.SetActive(true);
    }
}

// Tarkistetaan ettei nimi ole jo käytössä tai ettei input ole tyhjä ja kutsutaan formin lähetysfunktiota
public function NewCharacter() {

    warningMsg.SetActive(false);

    if (newCharName.text == "") {
        warningMsg.GetComponent(Text).text = "Enter Name!";
        warningMsg.SetActive(true);
    }

    else if (DublicateSearch()) {

        warningMsg.GetComponent(Text).text = "Name Already in use!";
        warningMsg.SetActive(true);
    }

    else {
        SendNewCharForm();
    }
}

// Tarkistetaan ettei nimi ole jo käytössä
public function DublicateSearch() {

    for (var i: System.Int32 = 0; i < ApplicationModel.characters.length; i++) {

        if (ApplicationModel.characters[i].ToString() == newCharName.text) {
            return true;
        }
    }
}

// Luodaan ja lähetetään uuden hahmon luomispyyntö, Päivitetään hahmoruutu
function SendNewCharForm() {

    var form = new WWWForm();
    form.AddField("accountId", ApplicationModel.account[0].ToString());
    form.AddField("characterName", newCharName.text);
    var www = new WWW(newCharacterUrl, form);

    yield www;

    if (www.error == null) {
        UpdateCharacters();
    }

    else {
        Debug.Log("WWW Error: " + www.error);
        warningMsg.GetComponent(Text).text = "Error creating Character.";
        warningMsg.SetActive(true);
    }
}

// Avataan paneeli jossa pyydetään käyttäjän vahvistusta hahmon poistolle
public function ConfirmDelete() {

    charInfo.SetActive(false);
    deleteBtn.SetActive(false);
    deletePanel.SetActive(true);

}

// Suljetaan hahmon poistamispaneeli
public function CancelDelete() {

    deletePanel.SetActive(false);
    charInfo.SetActive(true);
    deleteBtn.SetActive(true);
}

// Kutsutaan formin lähettävää funktiota
public function DeleteCharacter() {

    deleteMsg.GetComponent(Text).text = "Deleting Character..";

    SendDeleteForm();
}

// Luodaan ja lähetetään hahmon poistamispyyntö, Päivitetään hahmoruutu
public function SendDeleteForm() {

    var form = new WWWForm();
    form.AddField("accountId", ApplicationModel.account[0].ToString());
    form.AddField("characterName", charName.text);
    var www = new WWW(deleteUrl, form);

    yield www;

    if (www.error == null) {
        deleteMsg.GetComponent(Text).text = "Character deleted successfully!";
        UpdateCharacters();
    }

    else {
        Debug.Log("WWW Error: " + www.error);
        deleteMsg.GetComponent(Text).text = "Error deleting Character.";
        warningMsg.SetActive(true);
    }
}

// Haetaan hahmot uudelleen tietokannasta ja päivitetään näkymä
function UpdateCharacters() {

    ApplicationModel.characters = [];

    var form = new WWWForm();

    var account: String = ApplicationModel.account[1].ToString();
    form.AddField("account", account);

    var www = new WWW(charsUrl, form);

    yield www;

    if (www.error == null && !www.text.Contains("error")) {

        var separator: char[] = [","[0]];
        ApplicationModel.characters = www.text.Split(separator);
        ApplicationModel.characters.splice(ApplicationModel.characters.length - 1, 1);
        
        Application.LoadLevel("char select");
    }

    else if (www.text.Contains("error")) {
        Debug.Log(www.text);
    }

    else {
        Debug.Log("WWW Error: " + www.error);
    }
}