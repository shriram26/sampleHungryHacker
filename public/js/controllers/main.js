angular.module('foodController', [])

	// inject the Food service factory into our controller
	.controller('mainController', ['$scope','$http','Foods', function($scope, $http, Foods) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all foods and show them
		// use the service to get all the foods
		Foods.get()
			.success(function(data) {
				$scope.foods = data	;
				$scope.loading = false;
			});
		
		$scope.getTotalPrice = function(){
			Foods.totalPrice()
			.success(function(data) {
				$scope.totalPrice=data.total;
			}).error(function(data, status){
				$scope.loading = false;
			 	alert("Error in retrieving total");
			});
		};
		
		$scope.getTotalPrice();
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createFood = function() {
			// validate the formData to make sure that something is there
			var checkFlag = $scope.validateInput();
			if (checkFlag) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Foods.create($scope.formData)

					// if successful creation, call our get function to get all the new foods
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.foods = data; // assign our new list of foods
						$scope.getTotalPrice();
					})
					.error(function(data, status){
							$scope.loading = false;
						 	if(data=="dupError") alert("The item is already available in food menu. Delete the item first and then add again");
						 	else alert("Error in adding food!! Please try again later");
					 });
			}
			else{
				alert("Food Name and Price should be valid input");
			}
		};
		
		$scope.validateInput = function(){
			var foodName = $scope.formData.foodName;
			if(foodName!= undefined
					&& $scope.formData.price != undefined && foodName.trim().length > 0)
				return true;
			else
				return false;
					
		};

		// DELETE ==================================================================
		// delete a food after checking it
		$scope.deleteFood = function(id) {
			$scope.loading = true;

			Foods.delete(id)
				// if successful creation, call our get function to get all the new foods
				.success(function(data) {
					$scope.loading = false;
					$scope.foods = data; // assign our new list of foods
					$scope.getTotalPrice();
				});
		};
		
	}]);