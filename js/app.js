
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

						return {
							order: Users.nextOrder(),
							name: "Username",
							email: "Contact",
							twitter: "@twitter-handle",
							image: "http://community.invisionpower.com/uploads/profile/photo-259363.jpg"
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

						this.listenTo(Users, 'add', this.addOne);
						this.render();

					},

					render: function() {
						// console.log('raynder')
						Users.fetch();
						if(Users.length) {
							// this.addAll();
						}
					},

					addOne: function(user) {
						// console.log('adding one');
						var view = new UserView({model: user});
						this.$('#users').append(view.render().el);
					},

					addAll: function() {
				      	Users.each(this.addOne, this);
				    },

					createUser: function() {
						Users.create({});	
					}

			});
			var GameView = Backbone.View.extend({
				el: $('#game'),

				initialize: function() {
					$('#app').hide();
					$('#game').show();
					this.tiles = $('.tiles');
					console.log(this.tiles);
				}
			});

			var UserView = Backbone.View.extend({
					className:"users",

					template: _.template($("#card").html()),

					events: {
						'keypress .edit_name': 'changeName',
						'dblclick .name': 'editName',
						'keypress .edit_email': 'changeEmail',
						'dblclick .email': 'editEmail',
						'keypress .edit_twitter': 'changeTwitter',
						'dblclick .twitter': 'editTwitter',
						'click .follow': 'goTwitter',
						'click .delete_user': 'deleteUser',
						'change .files': 'changePicture'
						// 'mouseenter .thumbnail': 'onPicture',
						// 'mouseleave .thumbnail': 'offPicture'

					},

					initialize: function() {
						this.listenTo(this.model, 'change', this.render);
						this.listenTo(this.model, 'destroy', this.remove);
					},

					render: function() {
						this.$el.html(this.template(this.model.toJSON()));
						
						 if(this.model.get('name')=="") {
						 	this.$('.edit_name').show();
						 	this.$('.name').hide();
						 }
						 else {
						 	this.$('.edit_name').hide();
						 	this.$('.name').show();
						 }
						 
						 if(this.model.get('email')=="") {
						 	this.$('.edit_email').show();
						 	this.$('.email').hide();
						 }
						 else {
						 	this.$('.edit_email').hide();
						 	this.$('.email').show();
						 }

						 if(this.model.get('twitter')=="") {
						 	this.$('.edit_twitter').show();
						 	this.$('.twitter').hide();
						 }
						 else {
						 	this.$('.edit_twitter').hide();
						 	this.$('.twitter').show();
						 }

						 return this;
						//var view = new UserView({model: User});
					},
					editName: function() {
						this.$('.edit_name').show();
						this.$('.name').hide();
					},
					changeName: function(e) {

						if (e.keyCode != 13) return;
      					if (!this.$('.edit_name').val()) return;

						var name = this.$('.edit_name').val();
						this.model.set('name', name);
						this.model.save();

						this.$('.edit_name').hide();
						this.$('.name').show();
						Users.fetch();

						if(name=='heavypennies') {
							var Game = new GameView();
						}
					},
					editEmail: function() {
						this.$('.edit_email').show();
						this.$('.email').hide();
					},
					changeEmail: function(e) {
						if (e.keyCode != 13) return;
      					if (!this.$('.edit_email').val()) return;

						var email = this.$('.edit_email').val();
						
						this.model.set('email', email);
						this.model.save();

						this.$('.edit_email').hide();
						this.$('.email').show();
						Users.fetch();
					},
					editTwitter: function() {
						this.$('.edit_twitter').show();
						this.$('.twitter').hide();
					},
					changeTwitter: function(e) {
						console.log(e);
						if (e.keyCode != 13) return;
      					if (!this.$('.edit_twitter').val()) return;

						var twitter = this.$('.edit_twitter').val();
						
						this.model.set('twitter', twitter);
						this.model.save();

						this.$('.edit_twitter').hide();
						this.$('.twitter').show();
						Users.fetch();
					},
					goTwitter: function() {
						if(this.model.get('twitter')=="") return;

						var url = "https://twitter.com/"+this.model.get('twitter');
						window.open(
							url,
							'_blank'
						);
					},
					changePicture: function(evt) {
						var self = this;
						console.log(evt);
						var files = evt.target.files;
						var f = files[0];
						var reader = new FileReader();
						reader.onload = (function(theFile) {
							return function(e) {
							  // Render thumbnail.

								self.model.set('image', e.target.result);
								self.model.save();
							};
						})(f);

					      // Read in the image file as a data URL.
					      reader.readAsDataURL(f);
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