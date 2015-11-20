Template.home.helpers({
	'elements': function() {
		return PlanningElements.find()
	},
	'getElement': function(id) {
		return PlanningElements.findOne(id)
	},
	'day': function() {
		var day = new Date().getDay()-1;
		var dayList = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
		return Planning.findOne({day: dayList[day]})
	},
	'startTime': function(id) {
		var hour = Planning.findOne(id).schedule[0].start.toString();
		return hour.slice(0, 2)+"h"+hour.slice(2)
	},
	'endTime': function(id) {
		var last = Planning.findOne(id).schedule.length-1;
		var hour = Planning.findOne(id).schedule[last].end.toString();
		return hour.slice(0, 2)+"h"+hour.slice(2)
	}
});

Template.home.events({
	
});