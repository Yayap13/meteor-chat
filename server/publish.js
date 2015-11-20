//Publications
Meteor.publish('getAllPlanningElements', function(){
	return PlanningElements.find()
});

Meteor.publish('getPlanning', function(){
	return Planning.find()
});

Meteor.publishComposite('getChat', function() {
	return {
		find: function() {
			return Chat.find({}, { limit: 25, sort: { date: -1 } });
		},
		children: [
			{
				find: function(trade) {
					return Meteor.users.find({_id: trade.userId}, {limit: 1, fields: {username: 1}});
				}
			}
		]
	}
});

Meteor.publish('getChatSettings', function(){
	//Add new chat user
	Meteor.call('addChatUser');

	this.onStop(function() {
		Meteor.call('removeChatUser');
	});
	return ChatSettings.find()
});
