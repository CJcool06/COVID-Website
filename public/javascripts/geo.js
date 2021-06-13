/* Startup */
loadUser();




var geo = new Vue({
    el: "#geo",
    data: {
        location:null,
        latitude:null,
        longitude:null,
        gettinglocation: false,
        errorstr: null
    }
});

function getGeo() {

    function success(position){
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.location = position;
    }

    var enableHighAccuracy = true;

 /*   to determine if browser supports geolocation and handle other errors:
    function error(){
        this.errorstr = 'Unable to retrieve location'
    }

    if(!navigator.geolcation){
        this.errorstr = 'Geolocation is not supported by your browser';
    }
    else{
        navigator.geolocation.getCurrentPosition(success,error);
    }

    otherwise without errors being handled:
    */
    navigator.geolocation.getCurrentPosition(success,enableHighAccuracy);

}
