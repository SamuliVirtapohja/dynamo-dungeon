#pragma strict
import UnityEngine.UI;

public var accountName: InputField;
public var password: InputField;
public var btnText: Text;
public var loginError: GameObject;

// Globaalit muuttujat
public class ApplicationModel {

    static public var account: Array = [];
    static public var characters: Array = [];

    static public var characterName: String;
    static public var characterExp: System.Int32;
    static public var characterLevel: System.Int32;

    static public var expGained: System.Int32;
    static public var levelsGained: System.Int32;
    static public var enemiesKilled: System.Int32;
}

var loginUrl = "https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/login.php";
var charsUrl = "https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/characterNames.php";

// Siirrytään rekisteröitymisnäkymään
public function CreateAccount() {
    Application.LoadLevel("register");
}

// Tarkistetaan onko kentissä syötettä ja kutsutaan formin lähetysfunktiota
public function GetAndSend() {

    loginError.SetActive(false);
    btnText.text = "Logging in";

    if (accountName.text != "" && password.text != "") {
        SendHttpRequest();
    }

    else {
        loginError.GetComponent(Text).text = "Enter account name and password";
        loginError.SetActive(true);
        btnText.text = "Login";
    }

}

// Vahvistetaan kirjautumistiedot tietokannasta ja asetetaan ne globaaleihin muuttujiin
function SendHttpRequest() {

    var form = new WWWForm();
    form.AddField("account", accountName.text);
    form.AddField("password", password.text);
    var www = new WWW(loginUrl, form);

    yield www;

    if (www.text == "Incorrect password" || www.text == "") {
        loginError.GetComponent(Text).text = "Incorrect Username/Password";
        loginError.SetActive(true);
        btnText.text = "Login";
    }

    else if (www.error == null) {
        var separator: char[] = [" "[0]];
        ApplicationModel.account = www.text.Split(separator);
        GetCharacters();
    }

    else {
        Debug.Log("WWW Error: " + www.error);
        btnText.text = "Login";
    }
}

// Haetaan käyttäjän hahmot tietokannasta, lisätään ne taulukkoon ja siirrytään hahmonvalintanäkymään
public function GetCharacters() {

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
        loginError.SetActive(true);
        Debug.Log(www.text);
        btnText.text = "Login";
    }

    else {
        Debug.Log("WWW Error: " + www.error);
        btnText.text = "Login";
    }
}