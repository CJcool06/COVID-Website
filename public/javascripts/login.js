
/**
 * DISCLAIMER:
 * 
 * THIS IS NOT MY WORK!
 * 
 * - CHRIS
 */

/**
 * I CHANGED MY MIND, IM GOING TO USE THE LOGIN FUNCTION THAT I MADE FOR TESTING. IT ACTUALLY WORKS WITH VUE!
 */
function loginOLD(){
    var request = new XMLHttpRequest();
    const email = document.getElementById('login-email').value;
    const password=document.getElementById('login-password').value;

    // Not needed
    // - Chris
    
    // const username=document.getElementById('login-username').value;
    // const identity=document.getElementById('login-identity').value;

    request.onreadystatechange=function(){
        if(this.readyState==4&&this.status==200){
            // Removed alert and added redirect back to home page.
            // - Chris

            window.location.replace('/');

            // alert(this.response);
        }
    };
    request.open('POST','/login');
    request.setRequestHeader("Content-type","application/json");

    // I changed this line so it actually connects to the server with the correct data
    // - Chris
    request.send(JSON.stringify({ 'email': email, 'password': password }));
}