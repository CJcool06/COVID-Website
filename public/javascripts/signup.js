/**
 * DISCLAIMER:
 * 
 * THIS IS NOT MY WORK!
 * 
 * - CHRIS
 */

function signup(){
    var request = new XMLHttpRequest();
   
    const password=document.getElementById('signup-password').value;
    const identity=document.getElementById('signup-identity').value;

    // Added email & first/last name - Chris
    let email = document.getElementById('signup-email').value;
    let fname = document.getElementById('signup-fname').value;
    let lname = document.getElementById('signup-lname').value;

    request.onreadystatechange=function(){
        if(this.readyState==4&&this.status==200){

            // Added redirect back to home page.
            // - Chris

            window.location.replace('/');

            // alert(this.response);
        }
    };
    request.open('POST','/signup');
    request.setRequestHeader("Content-type","application/json");

    // Had to change this to work - Chris
    request.send(JSON.stringify({ 'fName': fname, 'lName': lname, 'email': email, 'password': password, 'accountType': identity }));
}