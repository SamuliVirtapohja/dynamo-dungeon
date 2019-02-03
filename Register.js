#pragma strict
import UnityEngine.UI;

public var account: InputField;
public var password: InputField;
public var email: InputField;
public var btnText: Text;
public var errorText: GameObject;

var registerUrl = "https://student.labranet.jamk.fi/~L4721/ttms0500/Harjoitustyo/register.php";

public function BackToLogin() {
    Application.LoadLevel("login");
}

// Tarkistetaan syöte
public function Register() {
    errorText.SetActive(false);

    btnText.text = "Creating account";

    if (account.text != "" && password.text != "" && email.text != "") {
        SendRegisterForm();
    }

    else {
        errorText.SetActive(true);
    }
}

// Luodaan ja lähetetään uuden käyttäjän luomispyyntö
function SendRegisterForm() {

    var form = new WWWForm();
    form.AddField("account", account.text);
    form.AddField("password", password.text);
    form.AddField("email", email.text);
    var www = new WWW(registerUrl, form);

    yield www;

    if (www.error == null) {
        Debug.Log(www.text);
        BackToLogin();
    }
    else {
        Debug.Log("WWW Error: " + www.error);
    }

}