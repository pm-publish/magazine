import { View, Modal } from './framework'



export const ListingForm = function() {};
ListingForm.prototype = new View();
ListingForm.constructor = ListingForm;
    // ListingForm.prototype.init = function(blogId, layout) 
    // {
    //     this.blogId = blogId;

    //     this.data = {
    //         'id': 0,
    //         'blogs':this.blogId,
    //         'media_ids': ''
    //     };
    //     this.layout = layout;
    //     console.log(this.blogId);
    //     this.events();
    // };
    ListingForm.prototype.container = {
        'main' : $('#listingForm')
    };
    ListingForm.prototype.listeners = 
    {
        "start_date" : function(data, topic) {
            this.data.start_date = data['start_date'];
        },
        "end_date" : function(data, topic) {
            this.data.end_date = data['end_date'];
        },
        "location" : function(data, topic) {
            this.data.latitude = data.location['latitude'];
            this.data.longitude = data.location['longitude'];
        },
        "delete image" : function(data, topic) {
            return this.deleteImage(data);
        },
        "after" : function(data, topic) {
            console.log(this.data);
        }
    };
    ListingForm.prototype.render = function() 
    {
        var form = this.container.main;
        var title = form.find("#title");
        var content = form.find("#content");

        title.val(this.data.title);
        content.val(this.data.content);

        this.clearErrorHightlights();

        this.addErrorHightlights();

        if (this.data.id) {
            $('#listingFormSubmit').text('UPDATE');
        }
        if (this.data.mediaData){
            this.renderImageThumbs(this.data.mediaData);
        }
    };
    ListingForm.prototype.clearErrorHightlights = function()
    {
        $("#formerror").removeClass('active');
        for (var field in this.compulsoryFields) {
            var fieldname = this.compulsoryFields[field].split('.').reverse()[0];
            $('#'+fieldname).removeClass('formError');
        }
    };
    ListingForm.prototype.addErrorHightlights = function()
    {
        if (this.errorFields.length > 0) {
            $("#formerror").addClass('active');
        }
        for (var field in this.errorFields) {
            $('#'+this.errorFields[field]).addClass('formError');
        }
    };
    ListingForm.prototype.saveImage = function(r, data)
    {
        var newImageId = r.media.media_id;
        data.media_id = newImageId;
        var mediaids = [];
        if (this.data.media_ids != "") {
            mediaids = this.data.media_ids.split(',');
        }
        mediaids.push(newImageId);
        this.data.media_ids = mediaids.join(',');
        this.data.media_id = mediaids[0];

        this.renderImageThumbs([data]);
        return true;
    };
    ListingForm.prototype.deleteImage = function(data) 
    {
        var info = data['delete image'].confirmDeleteImage;
        var elem = info.elem;
        var id = info.id;
        elem.parent().remove();

        mediaids = this.data.media_ids.split(',');
        var index = mediaids.indexOf(id.toString());
        if (index > -1) {
            mediaids.splice(index, 1);
        }
        
        if (mediaids.length > 0) {
            this.data.media_id = mediaids[0];
            this.data.media_ids = mediaids.join(',');
        } else {
            this.data.media_id = '';
            this.data.media_ids = '-1';
        }

        Acme.PubSub.publish('update_state', {'closeConfirm': ''});
    };
    ListingForm.prototype.renderImageThumbs = function(images) 
    {
        var imageArray = $('#imageArray');
        var html = "";
        var temp = Handlebars.compile(window.templates.carousel_item); 

        for (var i=0;i<images.length;i++) {
            var imagePath = images[i].url || images[i].path;
            html += temp({"imagePath": imagePath, 'imageid' : images[i].media_id});
        }
        imageArray.append(html);
    };
    ListingForm.prototype.clear = function(images) 
    {
        if (this.menus) {
            var menus = Object.keys(this.menus);
            for(var i=0;i<menus.length;i++) {
                this.menus[menus[i]].reset();
            }
        }
        $('#imageArray').empty();
        this.clearErrorHightlights();
        this.data = {
            'id': 0,
            'blogs': this.blogId,
            'media_ids': ''
        };
    };
    ListingForm.prototype.submit = function()
    {
        var validated = this.validate();
        if (!validated) {
            this.render();
            return;
        }

        this.data.theme_layout_name = this.layout;

        Acme.server.create('/api/article/create', this.data).done(function(r) {
            $('#listingFormClear').click();
            Acme.PubSub.publish('update_state', {'confirm': r});
            Acme.PubSub.publish('update_state', {'userArticles': ''});
        }).fail(function(r) {
            Acme.PubSub.publish('update_state', {'confirm': r});
            console.log(r);
        });
    };
    ListingForm.prototype.events = function() 
    {
        var self = this;
        $('input, textarea').on("change", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var data = {};
            var elem = $(e.target);
            var elemid = elem.attr('name');

            data[elemid] = elem.val();
            self.updateData(data);

            if (self.compulsoryFields.indexOf(elemid) > -1 ) {

                if (elem.val() == '') {
                    elem.addClass("formError");
                } else {
                    elem.removeClass("formError");
                }
            } 
        });


        // $('.uploadFileBtn').uploadFile({
        //    onSuccess: function(data, obj){

        //         var resultJsonStr = JSON.stringify(data);

        //         var postdata = {
        //             'blogs' : self.blogId,
        //             'imgData' : resultJsonStr
        //         };

        //         var outer = $("#uploadFileBtn");
        //         var inner = $("#InnerUploadFileBtn");
        //         outer.addClass("spinner");
        //         inner.hide();

        //         Acme.server.create('/api/article/save-image', postdata).done(function(r) {
        //             // console.log(r);
        //             // console.log(data);
        //             if (self.saveImage(r, data) ) {
        //                 outer.removeClass("spinner");
        //                 inner.show();
        //             }
        //         }).fail(function(r) {
        //             // console.log(r);
        //         });
        //     }
        // });

        $('#imageArray').on('click', '.carousel-tray__delete', function(e) {
            var elem = $(e.target);
            var mediaId = elem.data('id');
            Acme.PubSub.publish('update_state', {'confirmDeleteImage': {elem:elem, id:mediaId}});
        });

        $('#listingFormClear').on('click', function(e) {
            $('#listingFormSubmit').text('SUBMIT');
            self.clear();
        });

        $('#listingFormDelete').on('click', function(e) {
            Acme.PubSub.publish('update_state', {'confirmDelete': ""});
        });
        $('#listingForm').submit(function(e) {
            e.preventDefault();
            self.submit();
        });
    };
    ListingForm.prototype.validate = function(checkFields) {
        // checkFields is used to validate a single field, 
        // otherwise itereate through all compulsory fields

        // intersect used to clear the field we want to check 
        // from errorFields.  if still an error it will add again.
        function intersect(a, b) {
            var t;
            if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
            return a.filter(function (e) {
                return b.indexOf(e) > -1;
            });
        }

        var validated = true, fields = [];

        if (checkFields) {
            var fields = intersect(this.compulsoryFields, checkFields);
            for (var j=0; j<fields.length;j++) {
                var fieldName = fields[j].split('.').reverse()[0];
                var index = this.errorFields.indexOf(fieldName)
                this.errorFields.splice(index, 1);
            }
        } else {
            var fields = this.compulsoryFields;
            this.errorFields = []; // reset and re-calcuate all fields
        }


        for (var i=0;i<fields.length; i++) {
            var key = fields[i];
            var keySplit = key.split('.');
            var scope = this.data;
            for(var j=0; j<keySplit.length; j++) {

                if (!scope[keySplit[j]]) {
                    scope = false;
                    break;
                }
                if(j == keySplit.length -1 ) {
                    scope = scope[keySplit[j]];
                    break;
                }
                scope = scope[keySplit[j]];
            }

            if (!scope) {
                var fieldname = fields[i].split('.').reverse()[0];
                this.errorFields.push(fieldname); 
                validated = false;
            }
        }
        return validated;
    };



export const EventForm = function(blogId) 
{
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.eventForm.listener' : ['state_changed', 'update_state']
    });

    this.errorFields = [];

    this.compulsoryFields = [
        "title", 
        "content",
        "start_date",
        "end_date",
        "contact_name",
        "address1"
    ];

    this.blogId = blogId;

    this.data = {
        'id': 0,
        'blogs': this.blogId,
        'media_ids': '',
        'type': 'event'
    };

    this.events();
    this.events2();
};
    EventForm.prototype = new ListingForm();
    EventForm.prototype.constructor=Acme.EventForm;
    EventForm.prototype.formatDate = function(date) {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
    };
    EventForm.prototype.events2 = function() {
        const self = this;

        const startDateElem = document.getElementById('start_date');
        const endDateElem = document.getElementById('end_date');
        const pickerStart = new tempusDominus.TempusDominus(startDateElem, {
            display: {
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-angle-up",
                    down: "fa fa-angle-down",
                    next: "fa fa-angle-right",
                    previous: "fa fa-angle-left"
                }
            }
        });
        const pickerEnd = new tempusDominus.TempusDominus(endDateElem, {
            display: {
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-angle-up",
                    down: "fa fa-angle-down",
                    next: "fa fa-angle-right",
                    previous: "fa fa-angle-left"
                }
            }
        });
        startDateElem.addEventListener(tempusDominus.Namespace.events.change, (e) => {
            self.data.start_date = self.formatDate(e.detail.date);
            pickerEnd.updateOptions({
                restrictions: {
                    minDate: e.detail.date
                }
            });
        });
        endDateElem .addEventListener(tempusDominus.Namespace.events.change, (e) => {
            self.data.end_date = self.formatDate(e.detail.date);
        });



        // var EventPostGoogleMap = function () {
        //     var marker, geocoder;
        //     var elem = $('#addressMap');
        //     var latitude = elem.data('latitude');
        //     var longitude = elem.data('longitude');
        //     var map;
            
        //     //google.maps.event.addDomListener(window, 'load', initMap);
        //     function initMap() {
        //         var mapLat;
        //         var mapLong;
        //         if (latitude !== '' && longitude !== '') {
        //             mapLat = latitude;
        //             mapLong = longitude;

        //             geocoder = new google.maps.Geocoder();
        //             var params = {
        //                 zoom: 10,
        //                 center: {lat: mapLat, lng: mapLong}
        //             };
        //             map = new google.maps.Map(document.getElementById('addressMap'), params);

        //             //set current marker
        //             updateMarker = new google.maps.Marker({
        //                 position: new google.maps.LatLng(latitude, longitude),
        //                 map: map
        //             });
        //         } 
        //         else {
        //             //navigator.geolocation.getCurrentPosition(function (position) {});
        //             geocoder = new google.maps.Geocoder();
        //             map = new google.maps.Map(document.getElementById('addressMap'), {
        //                 zoom: 1,
        //                 center: {lat: 43.197167, lng: 56.425781}
        //             });
                    
        //         }
                
        //         pointLocation(geocoder, map, marker);
        //     }
            
        //     initMap();
        // };

        // var pointLocation = function (geocoder, map, marker) {
        //     $('#address1').on('change', function(e){
        //         mapLocation($(this));

        //     });
            
        //     function mapLocation(elem) {
        //         var address = elem.val();

        //         geocoder.geocode({address: address}, function (results, status) {
                    
        //             if (status === google.maps.GeocoderStatus.OK) {
        //                 map.setCenter(results[0].geometry.location);
        //                 map.setZoom(10);

        //                 //clear the previous marker
        //                 if (marker) {
        //                     marker.setMap(null);
        //                 }
        //                 marker = new google.maps.Marker({
        //                     map: map,
        //                     position: results[0].geometry.location
        //                 });
                        
        //                 // Set Lat and Long
        //                 var latitude = results[0].geometry.location.lat();
        //                 var longitude = results[0].geometry.location.lng();
        //                 var data = {
        //                     "location" : {
        //                         "latitude": latitude,
        //                         "longitude": longitude
        //                     }
        //                 };
        //                 Acme.PubSub.publish("update_state", data);
        //             } 
        //         });
        //     } 
        // };

        // EventPostGoogleMap();
    }

export const GoogleMap = function() {

    this.marker;
    this.geocoder;
    this.mapContainer = $('#addressMap');
    this.latitude = this.mapContainer.data('latitude');
    this.longitude = this.mapContainer.data('longitude');
    this.map;
    this.init();
};
	GoogleMap.prototype.init = function()
	{
		var mapLat;
		var mapLong;
		if (this.latitude !== '' && this.longitude !== '') {
			mapLat = this.latitude;
			mapLong = this.longitude;

			this.geocoder = new google.maps.Geocoder();
			var params = {
				zoom: 14,
				center: {lat: mapLat, lng: mapLong}
			};
			this.map = new google.maps.Map(document.getElementById('addressMap'), params);

			//set current marker
			updateMarker = new google.maps.Marker({
				position: new google.maps.LatLng(this.latitude, this.longitude),
				map: this.map
			});
		} 
		else {
			//navigator.geolocation.getCurrentPosition(function (position) {});
			geocoder = new google.maps.Geocoder();
			this.map = new google.maps.Map(document.getElementById('addressMap'), {
				zoom: 1,
				center: {lat: 43.197167, lng: 56.425781}
			});   
		}
	};



Acme.Confirm = function(template, parent, layouts) {

    this.template = template;
    this.parentCont = parent;
    this.layouts = layouts;
    this.parent = Acme.modal.prototype;
    this.data = {};
};
    Acme.Confirm.prototype = new Modal();
    Acme.Confirm.constructor = Acme.Confirm;
    Acme.Confirm.prototype.errorMsg = function(msg) {
        $('.message').toggleClass('hide');
    };
    Acme.Confirm.prototype.handle = function(e) {
        var self = this;
        var $elem = this.parent.handle.call(this, e);
        if ( $elem.is('a') ) {
            if ($elem.hasClass('close')) {
                $('body').removeClass("active");
                this.closeWindow();
            }
        }
        if ($elem.is('button')) {
            if ($elem.hasClass('signin')) {
                e.preventDefault();
                var formData = {};
                $.each($('#loginForm').serializeArray(), function () {
                    formData[this.name] = this.value;
                });
                Acme.server.create('/api/auth/login', formData).done(function(r) {
                    // console.log(r);
                    if (r.success === 1) {
                        window.location.href = location.origin;
                    } else {
                        self.errorMsg();
                    }
                }).fail(function(r) { console.log(r);});
            }

        }
        if ($elem.hasClass('layout')) {
            var layout = $elem.data('layout');
            this.renderLayout(layout);
        }

        if ($elem.data('role') === 'deleteImage') {
            Acme.PubSub.publish("update_state", {'delete image': self.data });
        }

    };

// var layouts = {
//     "listing"   : 'listingSavedTmpl',
//     "delete"   : 'listingDeleteTmpl',
// };

// Acme.confirmView = new Acme.Confirm('modal', 'signin', layouts);
//     Acme.confirmView.subscriptions = Acme.PubSub.subscribe({
//         'Acme.confirmView.listener' : ['update_state']
//     });

//     Acme.confirmView.listeners = 
//     {
//         "confirm" : function(data, topic) {
//             this.render("listing", "Thank you for submitting your event.");
//         },
//         "confirmDelete" : function(data, topic) {
//             this.render("delete", "Warning", { msg: "Are you sure you want to permanently delete this listing?", role:"delete"});
//         },
//         "confirmDeleteImage" : function(data, topic) {
//             this.data = data;
//             this.render("delete", "Warning", 
//                 {
//                      msg: "Are you sure you want to delete this image?", 
//                      role:"deleteImage"
//                  }
//             );
//         },
//         "closeConfirm" : function(data, topic) {
//             this.closeWindow();
//         }
//     };



