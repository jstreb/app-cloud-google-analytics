( function( $ ) {
  
  //Some static data.  In a real app this would most likely be fetched from the App Cloud server and stored via bc.core.cache.
  var _data = {
    items: [
      {
        "title": "List item number one.",
        "description": "Description for the first list item."
      },
      {
        "title": "List item number two.",
        "description": "Description for the second list item."
      }
    ]
  }
  
  /*
   * The Brightcove SDK will fire an "init" event after the document is ready, the device is ready to be interacted with and any
   * locale or markup files have been loaded and populated on the bc.templates object.
   */
  $( bc ).bind( "init", initialize );
  
  function initialize() {
    registerEventListeners();
    setContentOfPage();
  }
  
  /**
   * Any event listeners we need for this view we setup here.  Note that the elements we are binding to are not yet 
   * created which is why we use the delegate syntax.
   */
  function registerEventListeners() {
    $( "#first-page-content" ).on( "tap", "li", transitionToSecondPage );
    $( "#pagetwo" ).on( "tap", ".back-button", bc.ui.backPage );
  }
  
  /**
   * Sets the content of the first page.  In theory you will have fetched data from the appcloud server using bc.core.getData 
   * and now you will generate HTML markup using the built in markup templating library.  Here we are simply using the static data
   * we defined at the top file and passing that to the markup associated with this view.  This association happens in the 
   * manifest.json file.  However, you can use as much or as little of our SDK as you choose, so you could also simply fetch data 
   * directly from your server and then set the content here.
   */
  function setContentOfPage() {
    //The object we will pass to markup that will be used to generate the HTML.
    var context = { "listitems": _data.items };
    
    //The SDK automatically parses any templates you associate with this view on the bc.templates object.
    var markupTemplate = bc.templates["first-page-tmpl"];
    
    //The generated HTML for this template.
    var html = Mark.up( markupTemplate, context );
    
    //Set the HTML of the element.
    $( "#first-page-content" ).html( html );
  }
  
  /**
   * Sets any dynamic content for the second page and then transitions to that page.
   */
  function transitionToSecondPage( evt ) {
    //We are using index of the array to determine which element was clicks, but with your data if you have unique ID that would be ideal.
    var index = $( this ).index();
    
    //The object we will pass to markup that will be used to generate the HTML.
    var context = { "text": _data.items[index].description };
    
    //The SDK automatically parses any templates you associate with this view on the bc.templates object.
    var markupTemplate = bc.templates["second-page-tmpl"];
    
    //The generated HTML for this template.
    var html = Mark.up( markupTemplate, context );
    
    //Set the HTML of the element.
    $( "#second-page-content" ).html( html );
    
    //Transition to the new page.
    bc.ui.forwardPage( $( "#pagetwo" ) );
  }
  
})( jQuery )