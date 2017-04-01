/* Create the sweetAlert Service singleton */
function sweetAlertService() {
    this.success = function(title, message) {
        swal(title, message,'success');
    };

    this.error = function(title, message) {
        swal(title, message,'error');
    };

    this.warning = function(title, message) {
        swal(title, message,'warning');
    };

    this.info = function(title, message) {
        swal(title, message,'info');
    };

    this.custom = function (configObject) {
        swal(configObject);
    }
};

angular.module('app', ['ui.router','LocalStorageModule', 'uiGmapgoogle-maps'])
	.config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
		
		$stateProvider
		    .state('map', {
		        url: '/map',
		        templateUrl: '../views/map.html',
		        controller: 'ctrlMap'
		    })
		    .state('login', {
		        url: '/login',
		        templateUrl: "../views/login.html",
		        controller: 'ctrlLogin'
		    })
			.state('trips', {
		        url: '/trips',
		        templateUrl: "../views/trips.html",
		        controller: 'ctrlTrips'
		    })
		    .state('newTrip', {
		        url: '/trips/newTrip',
		        templateUrl: "../views/newtrip.html",
		        controller: 'ctrlNewTrip'
		    })
		    .state('newDriver', {
		        url: '/trips/createDriver',
		        templateUrl: "../views/createDriver.html",
		        controller: 'ctrlNewTrip'
		    })
		    .state('cashTrip', {
		        url: '/trips/cashTrip',
		        templateUrl: "../views/cashTrip.html",
		        controller: 'ctrlCashTrip'
		    });

		    $urlRouterProvider.otherwise('login');

		    localStorageServiceProvider
		    .setPrefix('myApp')
		    .setStorageType('sessionStorage')
		    .setNotify(true, true);
	})
	
	.factory('global', function ($state, $http, $rootScope, localStorageService) {
	    var global = {};
	    $rootScope.guardando = false;
	    global.startPoint = {};
	    global.endPoint = {};
	    global.uncashedTrip = {};
	    global.myTrips = new Array();
	    $rootScope.address = '';
	    var markerId = 0;

	    global.buttonValue = "indeterminate";

	    $rootScope.goto = function(to, desc){
	    	global.buttonValue = desc;	    	
	    	$state.go(to);
	    }
	    //Iniciar sesion
	    global.login = function(){
		        $http({
		            method: 'post',
		            cache: false,
		            headers: {'Content-Type': 'application/json'},
		            url: 'http://190.242.62.252:3000/app/reservaciones/' + localStorageService.get('sesion').usuario._id
		        })
		        .then(function successCallback(response) {
		            console.log(response);
		            $rootScope.cargando = false;
          			$rootScope.visible = true;
              		global.usuario_sesion = {}; //usuario en sesion
              		localStorageService.set('sesion', response.data);
              		if(response.data.usuario.tipo == 'Administrador'){
                		$rootScope.administrador = true;
            		}
            		$state.go('map');
              		global.visible = true; //se puede ver

		            if (response.data.err) {
		                
		                
		            }
		            else{
		              
		          	}
		      }
		      ,function errorCallback(response) {
		      //  Materialize.toast("Error Callback", 3000, 'rounded red');
		    });
    	};

    	//obtener mis viajes (Cliente)
    	global.getMyTrips = function() {
		        $http({
		            method: 'GET',
		            cache: false,
		            headers: {'Content-Type': 'application/json'},
		            url: 'http://localhost:1337/trips/' + '58c98631cff3df18c8fee9d5'
		        })
		        .then(function successCallback(response) {
		            console.log(response);
		            angular.copy(response.data.trips, global.myTrips);
		            $.toast({
					    heading: (response.data.error)? 'Error':'Success',
					    text: response.data.message,
					    icon: (response.data.error)?'error':'success',
						position: 'bottom-center',
						showHideTransition: 'slide',
						bgColor : (response.data.error)?'#ff0000': '#1663c9',
					    loader: true,        // Change it to false to disable loader
					    textColor : 'white',
					    loaderBg: (response.data.error)?'#c60000':'#9EC600'  // To change the background
						});		            
		      	}
		      	,function errorCallback(response) {
		    });
    	};

    	//Crear nuevo viaje
    	global.newTrip = function(trip){
		    $http({
		        method: 'post',
		        cache: false,
		        headers: {'Content-Type': 'application/json'},
		        url: 'http://localhost:1337/trips/' + '58c98631cff3df18c8fee9d5',
		        data : {
		        	longitudestart :trip.startPoint.longitudestart,
		            latitudestart : trip.startPoint.latitudestart,
		            longitudeend : trip.endPoint.longitudeend,
		            latitudeend : trip.endPoint.latitudeend
		            }
		        })
		        .then(function successCallback(response) {		
		            $.toast({
					    heading: (response.data.error)? 'Error':'Success',
					    text: response.data.message,
					    icon: (response.data.error)?'error':'success',
						position: 'bottom-center',
						showHideTransition: 'slide',
						bgColor : (response.data.error)?'#ff0000': '#1663c9',
					    loader: true,        // Change it to false to disable loader
					    textColor : 'white',
					    loaderBg: (response.data.error)?'#c60000':'#9EC600'  // To change the background
						});
		      	}
		      	,function errorCallback(response) {
		        //Materialize.toast("Error Callback", 3000, 'rounded red');
		    });
    	};

    	//Cobrar un  viaje (Conductor)
    	global.cashTrip = function(trip){
		    $http({
		        method: 'post',
		        cache: false,
		        headers: {'Content-Type': 'application/json'},
		        url: 'http://localhost:1337/trips/cash/' + global.uncashedTrip._id,
		        data : {
		        	duration : 2
		            }
		        })
		        .then(function successCallback(response) {		
		            $.toast({
					    heading: (response.data.error)? 'Error':'Success',
					    text: response.data.message,
					    icon: (response.data.error)?'error':'success',
						position: 'bottom-center',
						showHideTransition: 'slide',
						bgColor : (response.data.error)?'#ff0000': '#1663c9',
					    loader: true,        // Change it to false to disable loader
					    textColor : 'white',
					    loaderBg: (response.data.error)?'#c60000':'#9EC600'  // To change the background
						});
		            //Actualiza la GUI para quitar o dejar el viaje
		           if (response.data.error) {
		           		return false;
		           } else {
		           		global.uncashedTrip = {};
		           		return true;		           
		           	}
		      	}
		      	,function errorCallback(response) {
		       
		    });
    	};

    	//obtener viaje por cobrar (Conductor)
    	global.getUncashedTrip = function() {
		    $http({
		        method: 'GET',
		        cache: false,
		        headers: {'Content-Type': 'application/json'},
		        url: 'http://localhost:1337/trips/uncashed/' + '58dd1324aa48b70a043b640c'
			})
		        .then(function successCallback(response) {
		        		angular.copy(response.data.trip, global.uncashedTrip);
		       			//Notificación visual
		        		$.toast({
					    heading: (response.data.error)? 'Error':'Success',
					    text: response.data.message,
					    icon: (response.data.error)?'error':'success',
						position: 'bottom-center',
						showHideTransition: 'slide',
						bgColor : (response.data.error)?'#ff0000': '#1663c9',
					    loader: true,        // Change it to false to disable loader
					    textColor : 'white',
					    loaderBg: (response.data.error)?'#c60000':'#9EC600'  // To change the background
						});
		        		
		      	}
		      	,function errorCallback(response) {
		        alert("Error Callback")
		    });
    	};

		//Agregar conductor
		global.addDriver = function(driver){
    		http({
		            method: 'post',
		            cache: false,
		            headers: {'Content-Type': 'application/json'},
		            url: 'http://localhost:1337/drivers',
		            data : {
		            	name : driver.name + " " +driver.lastName,
		            	user : driver.user,
		            	password : driver.password,
		            	email : driver.email,
		            	phone : driver.phone
		            }
		        })
		        .then(function successCallback(response) {
		            
		            $rootScope.cargando = false;
          			              		
              		localStorageService.set('sesion', response.data);
              		if(response.data.usuario.tipo == 'Administrador'){
                		$rootScope.administrador = true;
            		}
            		$state.go('map');
              		global.visible = true; //se puede ver

		            if (!response.data.err) {
		               // Materialize.toast(response.data.msg, 3000, 'rounded blue');
		                
		            }
		            else{
		              //Materialize.toast(response.data.msg, 3000, 'rounded red');
		          	}
		      }
		      ,function errorCallback(response) {
		        // Materialize.toast("Error Callback", 3000, 'rounded red');
		    });
    	};

    	//Validar que haya unsa sesión activa
    	global.verificateSession = function () {
	       /* 
	       console.log('Verficar sesion: '+ localStorageService.get('sesion'));
	        if (localStorageService.get('sesion') == null)
	        {
	            $rootScope.visible = false;
	            $state.go('login');
	            return false;
	        }
	        if(localStorageService.get('sesion').usuario.tipo == 'Administrador'){
	            $rootScope.administrador = true;
	        }else{
	            $rootScope.administrador = false;
	        }

	        $rootScope.visible = true; //se puede ver?
	        $rootScope.usuario = localStorageService.get('sesion').usuario;*/
	        return true;	        
    	};

    	global.cerrarSesion = function(){
		     $rootScope.visible = false;
		     localStorageService.remove('sesion');
		     $state.go('login');
		};

		function create(latitude, longitude) {
	        var marker = {
	            latitude: latitude,
	            longitude: longitude,
	            id: ++ markerId          
	        };
	        return marker;        
    	}

    	function invokeSuccessCallback(successCallback, marker) {
	        if (typeof successCallback === 'function') {
	            successCallback(marker);	        }
    	}

    	global.createByCurrentLocation = function (successCallback) {
	        if (navigator.geolocation) {
	            navigator.geolocation.getCurrentPosition(function (position) {
	                var marker = create(position.coords.latitude, position.coords.longitude);
	                invokeSuccessCallback(successCallback, marker);
	            });
	        } else {
	            alert('Unable to locate current position');
	        }
    	}

    	global.createByAddress = function (address, successCallback) {
	        var geocoder = new google.maps.Geocoder();
	        geocoder.geocode({'address' : address}, function (results, status) {
	            if (status === google.maps.GeocoderStatus.OK) {
	                var firstAddress = results[0];
	                var latitude = firstAddress.geometry.location.lat();
	                var longitude = firstAddress.geometry.location.lng();
	                var marker = create(latitude, longitude);
	                invokeSuccessCallback(successCallback, marker);
	            } else {
	                alert("Unknown address: " + address);
	            }
	        });
    	}

		return global;
	})
	.service('swal', sweetAlertService)
	.controller('ctrlAddDriver', function (localStorageService,$rootScope, $scope, $state, global) {
	    if(!global.verificateSession()){return;}  

	    $scope.agregar = function(){
	        $rootScope.guardando = true;
	        global.addDriver($scope.driver);
	    }
	})
	.controller('ctrlNewTrip', function (localStorageService,$rootScope, $scope, $state, global) {
	    //if(!global.verificateSession()){return;}  
	    $scope.trip = {};
	    $scope.trip.startPoint = global.startPoint;
	    $scope.trip.endPoint = global.endPoint;

	    $scope.createTrip = function(){
	        $rootScope.guardando = true;
	        global.newTrip($scope.trip);
	    };

	})	
	.controller('ctrlTrips', function (localStorageService,$rootScope, $scope, $state, global) {
	    //if(!global.verificateSession()){return;}  
	    global.getMyTrips();
	    $scope.myTrips = global.myTrips;
	    
	})
	.controller('ctrlCashTrip', function (localStorageService,$rootScope, $scope, $state, global) {
	    //if(!global.verificateSession()){return;} 

	    global.getUncashedTrip();
	    $scope.trip = global.uncashedTrip;  

	    $scope.validateEmpty = function(obj){
	 	   return jQuery.isEmptyObject(obj);
		}

	    $scope.cashTrip = function(trip)  {
	    	$rootScope.guardando = true;
	    	global.cashTrip(trip);
	    };

	})
	.controller('ctrlLogin', function (localStorageService,$rootScope, $scope, $state, global) {
	    
	    
	})
	.controller('ctrlMenu', function (localStorageService,$rootScope, $scope, $state, global) {
	    //if(!global.verificateSession()){return;} 
	    
	})
	.controller('ctrlMap', function ($scope, $log, $timeout, $state,$rootScope, global, swal) {
	   	
		

	   function refresh(marker) {
            $scope.map.control.refresh({latitude: marker.latitude,
                longitude: marker.longitude});
        };

        $rootScope.addAddress = function(address) {
        	
            var address = $rootScope.address || address;
            if (address !== '') {
                global.createByAddress(address, function(marker) {
                	
        			refresh(marker);
        			$rootScope.marker.coords.latitude = marker.latitude;
        			$rootScope.marker.coords.longitude = marker.longitude;
                });
            }
        };


		//generar unas posiciones por defecto en caso de q el gps se tarde o no funcione
		$rootScope.map = {center: {latitude: 0, longitude: 0}, control: {}, zoom: 15  };
		$rootScope.marker = {
		      id: 0,
		      coords: {
		        latitude: 0,
		        longitude: 0
		      },
		      options: { draggable: true, animation :1 },
		      events: {
		        dragend: function (marker, eventName, args) {
		          $log.log('marker dragend');
		          $scope.actualLatitude = marker.getPosition().lat();
		          $scope.actualLongitude = marker.getPosition().lng();
		          $log.log($scope.actualLatitude);
		          $log.log($scope.actualLongitude);

		          $scope.marker.options = {
		            draggable: true,
		            labelContent: "lat: " + $scope.actualLatitude + ' ' + 'lon: ' + $scope.actualLongitude,
		            labelAnchor: "100 0",
		            labelClass: "marker-labels"
		          };
		        }
		      }
	    	};     
		//fin posiciones por defecto

		geolocationSuccess = function(position){	   
			
			$scope.actualLatitude = position.coords.latitude;
			$scope.actualLongitude = position.coords.longitude;
			$rootScope.map.center.longitude = position.coords.longitude;
			$rootScope.map.center.latitude = position.coords.latitude;

			$scope.options = {scrollwheel: false};
		    $scope.coordsUpdates = 0;
		    $scope.dynamicMoveCtr = 0;
		    
		    $rootScope.marker.coords.latitude = $scope.actualLatitude;
		    $rootScope.marker.coords.longitude = $scope.actualLongitude;
	   
		}

		geolocationError = function(){
			alert('geolocation undefined');
		};

		
		navigator.geolocation.getCurrentPosition(geolocationSuccess, 
   		geolocationError, { maximumAge: 3000, timeout: 7000, enableHighAccuracy: true });
	   
	   	$scope.buttonValue = global.buttonValue;

	   	$scope.goBack = function(to, value){

	   		if (value == "select start point") {
	   			
	   			global.startPoint.latitudestart = $scope.actualLatitude;
	   			global.startPoint.longitudeestart = $scope.actualLongitude;
	   		}
			if (value == "select end point") {
	   			global.endPoint.latitudeend =  $scope.actualLatitude;
	   			global.endPoint.longitudeend = $scope.actualLongitude;
	   		}
	   		$state.go(to);
	   	}	   

	    $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
	      if (_.isEqual(newVal, oldVal))
	        return;
	      $scope.coordsUpdates++;
	    });

	    $timeout(function () {

	      $scope.marker.coords = {
	        latitude: $scope.actualLatitude,
	        longitude: $scope.actualLongitude
	      };

	      $scope.dynamicMoveCtr++;
	      
	      $timeout(function () {
	        $scope.marker.coords = {
	          latitude: $scope.actualLatitude,
	          longitude: $scope.actualLongitude
	        };
	        $scope.dynamicMoveCtr++;
	      }, 2000);

	    }, 1000);
  	});

	