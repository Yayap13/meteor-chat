Meteor.methods({
	//Planning
	'updatePlanning': function(day, scheduleArr){
		if(Roles.userIsInRole(Meteor.userId(), ['admin', 'dev'])) {
			var planningId = Planning.findOne({"day": day})._id;

			Planning.update(planningId, { $set: { 'schedule': scheduleArr } });
		}
	},
	'addProgram': function(title, desc, cover, logo) {
		if(Roles.userIsInRole(Meteor.userId(), ['admin', 'dev'])) {
			PlanningElements.insert(
				{
					title: title,
					description: desc,
					cover: cover,
					game: logo
				}
			)
		}
	},
	'removeProgram': function(id) {
		if(Roles.userIsInRole(Meteor.userId(), ['admin', 'dev'])) {
			PlanningElements.remove(id);
		}
	},
	'addToPlanning': function(progId, dayId, start, end, force) {
		if(Roles.userIsInRole(Meteor.userId(), ['admin', 'dev'])) {
			var planning = Planning.findOne(dayId);
			schedule = planning.schedule;
			if(!force) {
				var place = 0;
				if(schedule!='') {
					for(var i=0; i<schedule.length; i++) {
						if(planning.schedule[i].start<start)
							place++;
					}
					schedule.splice(place, 0, {elementId: progId, start: start, end: end});
				} else {
					schedule = [{elementId: progId, start: start, end: end}];
				}
			} else {
				schedule.push({elementId: progId, start: start, end: end})
			}
			Planning.update(planning._id, { $set: { 'schedule': schedule } });
		}
	},
	'removeFromPlanning': function(dayId) {
		if(Roles.userIsInRole(Meteor.userId(), ['admin', 'dev'])) {
			Planning.update(dayId, { $set: { 'schedule': '' } });
		}
	},
	'addPlanningElement': function(title, desc, cover, game) {
		if(Roles.userIsInRole(Meteor.userId(), ['admin', 'dev'])) {
			if(Roles.userIsInRole(Meteor.userId(), ['admin', 'dev'])) {
				PlanningElements.insert(
					{
						title: title,
						description: desc,
						cover: cover,
						game: game
					}
				)
			}
		}
	},
	'removePlanningElement': function(id) {
		if(Roles.userIsInRole(Meteor.userId(), ['admin', 'dev'])) {
			//TODO check that this element is not used in the current planning
			PlanningElements.remove(id);
		}
	},

	//Chat
	'sendMessage': function(message) {
		if(Meteor.userId() && message.length<150 && message.length>0) {

			var settings = ChatSettings.findOne();

			if(message.charAt(0)=="/") {
				message=message.substring(1); //crop first character
				var cmd = message.substr(0,message.indexOf(' '));
				if(cmd=='') {
					cmd=message;
				} else {
					message = message.substr(message.indexOf(' ')+1);
				}
				
				if(Roles.userIsInRole(Meteor.userId(), ['admin', 'modo', 'dev'])) {
					if(cmd=='say') {
						Chat.insert(
							{
								userId: 'server',
								type: 'message',
								message: message,
								date: new Date()
							}
						);
					}
					if(cmd=='modo') {
						var user = Meteor.users.findOne({ "username" : message });
						
						if(user !== undefined && !Roles.userIsInRole(user._id, ['modo'])) {
							Roles.addUsersToRoles(user, ['modo']);
							Chat.insert(
								{
									userId: 'server',
									type: 'message',
									message: message+' est devenu un Modérateur!',
									date: new Date()
								}
							);
						}
	
					}
					if(cmd=='slowMode') {
						if(settings.slowMode) {
							ChatSettings.update(settings._id, { $set: { slowMode: false } });
							Chat.insert(
								{
									userId: 'server',
									type: 'message',
									message: 'SlowMode a été désactivé!',
									date: new Date()
								}
							);
						} else {
							ChatSettings.update(settings._id, { $set: { slowMode: true } });
							Chat.insert(
								{
									userId: 'server',
									type: 'message',
									message: 'SlowMode a été activé!',
									date: new Date()
								}
							);
						}
					}
					if(cmd=='slowRate' && message%1 === 0) { //modulo is to check if it's a number ;)
						ChatSettings.update(settings._id, { $set: { slowRate: parseInt(message) } });
						Chat.insert(
							{
								userId: 'server',
								type: 'message',
								message: 'Vous pouvez maintenant envoyer un message toutes les '+message+' secondes',
								date: new Date()
							}
						);
					}
					if(cmd=='modoOnly') {
						if(settings.modoOnly) {
							ChatSettings.update(settings._id, { $set: { modoOnly: false } });
							Chat.insert(
								{
									userId: 'server',
									type: 'message',
									message: 'Tout le monde peut à nouveau parler!',
									date: new Date()
								}
							);
						} else {
							ChatSettings.update(settings._id, { $set: { modoOnly: true } });
							Chat.insert(
								{
									userId: 'server',
									type: 'message',
									message: 'Seul les modérateurs peuvent parler!',
									date: new Date()
								}
							);
						}
					}
					if(cmd=='clear') {
						Chat.remove({});
						Chat.insert(
							{
								userId: 'server',
								type: 'message',
								message: 'Le chat a été entièrement effacé!',
								date: new Date()
							}
						);
					}
					if(cmd=="stats") {
						Chat.insert(
							{
								userId: 'server',
								type: 'message',
								message: 'Stats: '+Meteor.users.find().count()+' inscriptions, '+Chat.find().count()+' messages.',
								date: new Date()
							}
						);
					}
					if(cmd=="users") {
						Chat.insert(
							{
								userId: 'server',
								type: 'message',
								message: 'Il y a '+ChatSettings.findOne().users+' utilisateurs sur le chat!',
								date: new Date()
							}
						);
					}
				}
			} else {
				if(settings.modoOnly && !Roles.userIsInRole(Meteor.userId(), ['admin', 'modo', 'dev'])) {
					return
				} else if(settings.slowMode && !Roles.userIsInRole(Meteor.userId(), ['admin', 'modo', 'dev'])) {
					
					var now = new Date().getTime();
					if(Chat.findOne({userId: Meteor.userId(), date: { $lt: new Date(now), $gt: new Date(now - (1000*settings.slowRate)) } })===undefined) {
						Chat.insert(
							{
								userId: Meteor.userId(),
								message: message,
								date: new Date()
							}
						);
					}
				} else {
					Chat.insert(
						{
							userId: Meteor.userId(),
							message: message,
							date: new Date()
						}
					);
				}
			}
		}
	},
	'addChatUser': function() {
		var settings = ChatSettings.findOne()._id;
		ChatSettings.update(settings, { $inc: { users: 1 } });
	},
	'removeChatUser': function() {
		var settings = ChatSettings.findOne()._id;
		ChatSettings.update(settings, { $inc: { users: -1 } });
	}
});