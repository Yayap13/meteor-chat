/**
 * Created by Quentin on 01/10/2015.
 */

// main layout


Router.configure({
    layoutTemplate: 'layout'
});

token = false;

var checking = function checkLive() {
  var key_skyyart = 'x2m6m14';

 var statuslink = "https://api.dailymotion.com/video/"
  + key_skyyart
  + "?fields=onair?_="
  + new Date().getTime();
 $.getJSON(statuslink, function (json) {
  live = json.onair;
  console.log(live);
  if (live === false) {
    $('div.offline').css('display','inline-block');
 
  
}

else {

  $('div.onlive').css('display','inline-block');
  
  
}
 });

this.next();
};

Router.before(checking,token);

Router.map(function () {
    this.route('home', {
        path: '/',

        waitOn: function() {
          return [Meteor.subscribe('getAllPlanningElements'), Meteor.subscribe('getPlanning')];
        },
        
        onRun: function() {
        	
        	
        
          $('iframe').removeClass('invisible-player');
        
            this.render('home');
              this.next()
      

        },

        onBeforeAction: function () {
   
         $('.wrapper-home').css('display','table');
          $('li.live').addClass('active current');
           this.next()

       
        },
     
          onStop: function () {
           $('footer.footer ul li').removeClass('active temp current ');
          
          
           
           

       
        }

         
    });
});