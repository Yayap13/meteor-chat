Template.chat.helpers({
	'messages': function() {
		return Chat.find()
	},
	'getUsername': function(userId) {
		return Meteor.users.findOne(userId).username
	},
	'isMention': function(message) {
		if(message.charAt(0)=="@") {
			message=message.substring(1);
			var mentioned = message.substr(0,message.indexOf(' '));
			if(Meteor.user().username==mentioned) {
				return true
			}
		}
		return false
	},
	'isServer': function(userId) {
		return userId=='server'
	}
});

Template.chat.events({
	"keydown #self-comment": function(e) {
		if (e.keyCode === 13) {
			if(canSendMessage()) {
				Session.set('lastMessage', new Date());
				Meteor.call("sendMessage", $('#self-comment').val());
				$('#self-comment').val('').focus(); return false;    
			} else {
				e.preventDefault();
			}
		}
	},
	'click .devClear': function() {
		Meteor.call("clearChat");
	}
});

Template.chat.onCreated(function() {
	//Just add an event to change this value! Yay!
	Session.set('scrollChat', true);
	Session.set('lastMessage', new Date());
	this.subscribe("getChat");
	this.subscribe("getChatSettings");
	var chat = Chat.find();
	chat.observe({
		added: function(doc, beforeIndex) {
			var elem = $("#table-scrollable");
			if(elem && Session.get('scrollChat')) {
				elem.scrollTo({top:'100%', left:'0%'}, 200);
			}
		}
	});
	window.setInterval(function() {
		if(!canSendMessage()) {
			$('#self-comment').addClass('locked');
		} else {
			$('#self-comment').removeClass('locked');
		}
	}, 200);
});

function canSendMessage() {
	if(!Roles.userIsInRole(Meteor.userId(), ['admin', 'dev', 'modo'])) {
		var settings = ChatSettings.findOne();
		if(settings.modoOnly) {
			return false
		} else if(settings.slowMode) {
			var before = Session.get('lastMessage');
			return new Date(before.getTime() + (1000*settings.slowRate)+500) < new Date() ? true : false;
		} else {
			return true
		}
	}
	return true
}