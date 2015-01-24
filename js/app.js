
require.config({
	// waitSeconds: 0,
	baseUrl:'js',
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

			var User = Backbone.Model.extend({
					defaults: function() {
						console.log('whoa');
						return {
							order: Users.nextOrder(),
							name: "",
							email: "",
							twitter: "",
							picture: ""
						}
					}
			});

			var UserList = Backbone.Collection.extend({
					model:User,
					localStorage: new Backbone.LocalStorage("app-backbone"),
					nextOrder: function() {
				      if (!this.length) return 1;
				      return this.last().get('order') + 1;
				    }
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
						console.log('raynder')
						Users.fetch();
						if(Users.length) {
							// this.addAll();
						}
					},

					addOne: function(user) {
						console.log('adding one');
						var view = new UserView({model: user});
						this.users.append(view.render().el);
					},

					addAll: function() {
				      Users.each(this.addOne, this);
				    },

					createUser: function() {
						Users.create({});	
					}

			});

			var UserView = Backbone.View.extend({

					tagName: 'div',
					className: 'users',

					template: _.template($("#card").html()),

					events: {
						'click .delete_user': 'deleteUser'
					},

					initialize: function() {

						this.listenTo(this.model, 'destroy', this.remove);
					},

					render: function() {
						 if(this.model.name=="") {
						 	this.$('.input').show();
						 	this.$('.name').hide();
						 }
						 else {
						 	this.$('.input').show();
						 	this.$('.name').hide();
						 }
						 this.$el.html(this.template(this.model.toJSON()));
						 return this;
						//var view = new UserView({model: User});
					},

					deleteUser: function() {
						// console.log('deleting');
						this.model.destroy();
					}
			});
			var App = new AppView;
		});
	// });
});