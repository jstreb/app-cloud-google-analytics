##Google Analytics for App Cloud

### Overview
The google analytics app cloud plugin was created in order to support Google Analytics within an App Cloud application.  Why you might ask is this necessary if Google Analytics is just JavaScript?  There are were two issues that we wanted to address:

1.  By default Google Analytics requires the support of cookies.  In a published application the files are served from the file system which does not support cookies.
2.  We wanted to provide offline support so that we could track any events that may happen while not connected.

Because this is an application and not a website we are simply tracking events rather then page views.  Documentation for Google Analytics event tracking can be found [here.](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide "Tracking documentation")

### Installation

1.  Copy the /lib/ga-appcloud.js file into your application and include it in your HTML files after the App Cloud SDK.
2.  If you do not already have a google analytics account, create one [here.](http://support.google.com/googleanalytics/bin/static.py?hl=en&topic=19785&guide=19779&page=guide.cs)
3.  After logging into your google analytics account, find your account ID in the top left hand corner.  Should be a number that begins with "UA".  Usually in the format of "UA-xxxxxx-x".  At the top of the ga-appcloud.js replace the current ACCOUNT ID with your ID.
4.  (Optional) At the top of the ga-appcloud.js file replace the HOST_NAME value with your domain.

### Usage

To trigger an event simply call the ``bc.ga._trackEvent`` method and pass in your values.  The ``bc.ga._trackEvent`` takes the following parameters:

* Category - A string that is the category for this event.  This allows you to ogranize your events in the google analytics dashboard by category.
* Action - A string that is the action for this event.  Similar to the category, the google analytics dashboard allows you organize your events by action.  This is typically what the event actually is, for example a play event, or a fullscreen event.
* Label - *optional* The label is a string that allows you to provide additional information about this event.
* Value - *optional* A **number** that will be passed to the event so that you do additional analysis in google analytics.  For example an event for how long the user watched a video could be passed as value and then summarized in the google analytics dashboard.

### Example

A full example can be found in the example directory, but below is a quick example.


	<html>
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0" />
		    <meta name="apple-mobile-web-app-capable" content="yes" />
		    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
		    <title>GA event example</title>
		    <link rel="stylesheet" href="../stylesheets/theme-1.10.css" />
		    <script type="text/javascript" src="../javascripts/lib/brightcove-app-cloud-1.10.js"></script>
		    <script type="text/javascript" src="../javascripts/lib/ga-appcloud.js"></script>
		    <script type="text/javascript">

		    	$( bc ).bind( "viewfocus", sendEvent );

		    	function sendEvent() {
		    		//Send the actual event to 
		    		bc.ga._trackEvent( "my mobile app", "view" );
		    	}
		    </script>
		 </head>
		 <body>
		 	<p> This page will send a view event when it loads, and any time that it is navigated to.</p>
		 </body>
	</html>

### Thanks and credits

* Remy Sharp http://remysharp.com/2009/02/27/analytics-for-bookmarklets-injected-scripts/
* Eric Hynds