
require.config({
	// waitSeconds: 0,
	paths: {
	    jquery: 'jquery.min',
	    underscore: 'underscore.min',
	    backbone: 'backbone.min',
	    'backbone.localStorage': 'backbone.localStorage',
	    card: 'card'
  	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		}
	}
});
require(['jquery','underscore','backbone','backbone.localStorage'], function ($, _, Backbone) {   // or, you could use these deps in a separate module using define
	// define(['underscore', 'backbone', 'backbone.localStorage'], function(_, Backbone) {
		$(function(){


			console.log('hello');
			var User = Backbone.Model.extend({
					defaults: {
						name: "",
						email: "",
						twitter: "",
						picture: ""
					}
			});

			var UserList = Backbone.Collection.extend({
					model:User,

					localStorage: new Backbone.LocalStorage("app-backbone")
			});

			var Users = new UserList();

			var AppView = Backbone.View.extend({
					el: $("#app"),

					events: {
						'click #new_card': 'createUser'
					},

					initialize: function() {
						this.users = this.$('#users');
						this.listenTo(Users, 'add', this.addOne);
						this.render();

					},

					render: function() {
						Users.fetch();
						if(Users.length) {
							this.addAll();
						}
					},

					addOne: function(user) {

						var view = new UserView({model: user});
						this.users.append(view.render().el);
					},

					addAll: function() {
				      Users.each(this.addOne, this);
				    },

					createUser: function() {

						Users.create();
					}

			});

			var UserView = Backbone.View.extend({

					tagName: 'div',
					className: 'users',

					template: _.template($("#card").html()),

					events: {
						'click #delete_user': 'deleteUser'
					},

					initialize: function() {
						//console.log(Users.length);
					},

					render: function() {
						 this.$el.html(this.template(this.model.toJSON()));
						 return this;
						//var view = new UserView({model: User});
					},

					deleteUser: function() {
						// console.log('deleting');
						console.log(this.model);
						Users.remove(this.model);
					}
			});
			var App = new AppView();
		});
	// });
});