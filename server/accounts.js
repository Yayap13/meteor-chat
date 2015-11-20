//Callback to each new User creation
Accounts.onCreateUser(function(options, user) {
	/*
	user.avatar = false;
	user.stripeId = null;
	user.stripeSub = null;
	*/
	if (options.profile)
		user.profile = options.profile;
	return user;
});