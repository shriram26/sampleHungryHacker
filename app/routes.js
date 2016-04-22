var Food = require('./models/food');

function getFoods(res) {
    Food.find(function (err, foods) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.status(500).send(err);
        }

        res.json(foods); // return all foods in JSON format
    });
}
;

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all foods
	
	app.get('/api/foods/total', function (req, res) {
        
   	 	Food.aggregate({ $group: {
					            _id: null,
					            total: { $sum: {$multiply :["$price" , 1.075 ]}}
					        }}, function (err, result) {
	                         if (err) {
	                             res.status(500).send(err);
	                         }
	                         else{
	                        	 console.log(result);
	                        	 var text = result.length > 0?JSON.stringify(result[0]):JSON.stringify({total:0.00});
	                        	 console.log(text);
		                         res.status(200).json(JSON.parse(text));
	                         }
	                     });
    });

    app.get('/api/foods', function (req, res) {
        
        getFoods(res);
    });

    // create food and send back all foods after creation
    app.post('/api/foods', function (req, res) {

        // create a food, information comes from AJAX request from Angular
        Food.create({
            foodName: req.body.foodName,
            price:req.body.price,
            done: false
        }, function (err, food) {
            if (err){
            	  console.log(err);
            	  if(err.message.indexOf('duplicate')){
            		  res.status(400).send("dupError");
            	  }
            	  else{
            		  res.status(500).send(err);
            	  }
            }
            else{
            	getFoods(res);
            }
            // get and return all the foods after you create another
            
        });

    });

    // delete a food
    app.delete('/api/foods/:food_id', function (req, res) {
        Food.remove({
            _id: req.params.food_id
        }, function (err, food) {
            if (err)
                res.send(err);

            getFoods(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

};