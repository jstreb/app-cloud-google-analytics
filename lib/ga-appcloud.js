/*global bc:true, atob:false*/
/*jshint indent:2, browser: true, white: false devel:true undef:false*/

(function( bc, undefined ) {
  //Values to be changed
  var ACCOUNT = "UA-28223686-1";
  var HOST_NAME = "http://your-domain";// This dictates whether or not a new "bucket" is created in google analytics.
  
  var i = 1000000000; // seed
  var page_href = location.pathname.split("/").pop(); // videos.html
  var page_name = page_href.replace(".html", "");
  var os = (navigator.userAgent.indexOf("Mac OS X") > -1) ? "ios" : "android"; // allows filtering by os in the dashboard
  var title = document.title;
  var res = window.innerWidth + "x" + window.innerHeight; // screen resolution
  var today = (new Date()).getTime();
  var $img = $( "<img />" );
  var eventQueue = bc.core.cache( "ga_eventQueue", eventQueue ) || [];
  var errorQueue = bc.core.cache( "ga_errorQueue", errorQueue ) || [];
  var sending = false;
  
  if( bc === undefined ) {
    console.warn( "ga-appcloud.js requires that AppCloud SDK be included first." );
    return;
  }
  
  bc.ga = {};
  
  /**
   * The public API for our google analytics integration.  Any event that you want to track should be sent through here.  The event object takes
   * the following properties.  object, action and label.  The object property is a way to organize your various categories, the action is the 
   * actual event that we are tracking, and the label is the text that will appear for this event in the google analytics dashboard.
   * @param event
   */
  bc.ga._trackEvent = function( category, action, opt_label, opt_value ) {
    var cookie = rand(10000000, 99999999); // random cookie number
    var random = rand(i, 2147483647); // number under 2147483647
    var session = getSessionCookie();
    var src;
    
    if( category === undefined || action === undefined ) {
      console.error( "ERROR: trying to send an event to google analytics, but category and/or action is not defined." );
      return;
    }

    src = "http://www.google-analytics.com/__utm.gif?utmwv=4.3as&utmn=" + today;
    src += "&utmhn=" + HOST_NAME; // host name
    src += "&utmt=event"; // we're tracking an event
    src += "&utme=" + createEventString( category, action, opt_label, opt_value ); // the event data
    src += "&utmcs=UTF-8"; // encoding
    src += "&utmsr=" + res; // screen resolution
    src += "&utmsc=24-bit"; // color depth
    src += "&utmul=en-us"; // lang
    src += "&utmje=0"; // javascript enabled?
    src += "&utmfl=-"; // flash version
    src += "&utmdt=" + title; // page title
    src += "&utmhid=1"; // random number to link to adsense, which does not apply to us.
    src += "&utmr=-";  // referral URL
    src += "&utmp=" + page_href; // page
    src += "&utmac=" + ACCOUNT; // ACCOUNT num
    src += "&utmcc=__utma%3D" + getSessionCookie() + ".127%3B%2B__utmz%3D" + cookie + "." + today + ".20.2.utmcsr%3D" + os + "%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D%2F%3B";
    
    eventQueue.push( src );
    send();
  };

  //Listen for the load event on the image object.  Once it loads we know that we sent the event successfully and can push it off the queue.
  $img.on( "load", function() {
    eventQueue.shift();
    sending = false;
    if( errorQueue.length > 0 ) {
      eventQueue = eventQueue.concat( errorQueue );
      errorQueue = [];
    }
    send();
    console.log( "sent successfully" );
  });
  
  //If there is an error loading the image then we need to save it in the error queue so that it can be tried once we have a successful request.
  $img.on( "error", function() {
    errorQueue.push( eventQueue.shift() );
    sending = false;
    send();
    console.log( "error sending event." );
  });
  
  function persist() {
    bc.core.cache( "ga_eventQueue", eventQueue );
    bc.core.cache( "ga_errorQueue", errorQueue );
  }
  
  function send() {
    if( !sending && eventQueue.length > 0 ) {
      sending = true;
      $img.attr( "src", eventQueue[0] );
    }
    persist();
  }
  
  function createEventString( category, action, opt_label, opt_value ) {
    //Wondering what is going on here?  Check out the documentation here, https://developers.google.com/analytics/resources/articles/gaTrackingTroubleshooting.
    var str = "5(" + encodeURIComponent( category ) + "*" + encodeURIComponent( action );
    if( opt_label ) {
      str += "*" + encodeURIComponent( opt_label );
    }
    str += ")";
    if( opt_value && typeof options.value === "number" ) {
      str += "(" + encodeURIComponent( opt_value ) + ")";
    }
    
    return str;
  }
  
  /**
   * returns a cookie from localstorage. if one doesn't exist,
   * create a new cookie and store it. this is how unique vs.
   * total users are tracked.
   */
  function getSessionCookie() {
    var c = localStorage.getItem("GASessionCookie");
    if(c) return c;

    var cookie = rand(10000000, 99999999);
    var random = rand(i, 2147483647);
    c = cookie+"."+random+"."+today+"."+today+"."+today;

    localStorage.setItem("GASessionCookie", c);

    return c;
  }

  function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  }

})( bc );