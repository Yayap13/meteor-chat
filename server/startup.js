Meteor.startup(function () {

	//Create default admin user
	if(!Meteor.users.find().count()) {
		console.log('Creating user..');
		var options = {
			username: 'Skyyart', 
			password: 'test321', 
			email: 'Skyyart@gmail.com',
			roles: ['admin']
		};
		Accounts.createUser(options);

		var options = {
			username: 'Yayap13', 
			password: 'test321', 
			email: 'yayap13@gmail.com',
			roles: ['dev']
		};
		Accounts.createUser(options);

		console.log('Creating roles..');
		var user = Meteor.users.findOne({ "username" : 'Skyyart' });
		Roles.addUsersToRoles(user, ['admin']);

		var user2 = Meteor.users.findOne({ "username" : 'Yayap13' });
		Roles.addUsersToRoles(user2, ['dev']);
	}

	//Create default planning element
	if(!PlanningElements.find().count()) {
		console.log('Creating base planning element..');
		PlanningElements.insert(
			{
				title: 'Lags of Legends',
				description: 'Sky et Obama jouent à lags of legends.',
				cover: 'http://adoptadogesorensen.weebly.com/uploads/1/1/8/2/11828599/s247050843342300476_p1_i1_w500.jpeg',
				game: 'http://jolstatic.fr/www/captures/957/6/39496-640.jpg'
			}
		);

		PlanningElements.insert(
			{
				title: 'Viridi',
				description: 'Jaime les plantes.',
				cover: 'http://adoptadogesorensen.weebly.com/uploads/1/1/8/2/11828599/s247050843342300476_p1_i1_w500.jpeg',
				game: 'http://jolstatic.fr/www/captures/957/6/39496-640.jpg'
			}
		);
	}

	//Create default planning
	if(!Planning.find().count()) {
		console.log('Creating base planning template..');

		var defaultElementId = PlanningElements.findOne()._id;
		
		for(var i=0; i<7; i++) {
			var dayList = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
			var day = dayList[i];
			Planning.insert(
				{
					day: day,
					schedule: [
						{elementId: defaultElementId, start: 1700, end: 1800},
						{elementId: defaultElementId, start: 1800, end: 2000},
						{elementId: defaultElementId, start: 2100, end: 2230}
					]
				}
			);
		}
	}

	//Create default chat settings
	if(!ChatSettings.find().count()) {
		ChatSettings.insert(
			{
				users: 0,
				slowMode: false,
				slowRate: 3,
				modoOnly: false
			}
		);
	}
});
