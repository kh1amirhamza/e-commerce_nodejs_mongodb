var mongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

//Middleware...
app.use(express.json())


const url = 'mongodb+srv://ecommerce:ecommerce@cluster0.p4fnz.mongodb.net?retryWrites=true&w=majority';
const config = { useUnifiedTopology: true };

app.post('/addProduct', function (req,res){
    let productData = req.body;
    console.log(productData);
     let productName = productData.name;
     let productPrice = productData.price;

    mongoClient.connect(url,config,function (error,myMongoClient){
        if (error){
            console.log('Connection Failed!')
        }else {
            var  productsDb= myMongoClient.db('products');
            var detailsCollec = productsDb.collection('details');

            generateId(myMongoClient,function (id){
                var data = { _id: id, name: productName+id, price: productPrice+id};
                //var data = { _id: id, name: 'product'+id, price: 500+id};
                insertData(myMongoClient,id,data,detailsCollec);
                res.send('{"message":"Product insert successful"}',)
                res.end()
            });
        }
    });


});

const PORT = process.env.PORT || 2020
app.listen(PORT, function (err) {
    if (err){
        console.log(err)
    }else {
        console.log('Server is running on port: ' + PORT)
    }
});

/*mongoClient.connect(url,config,function (error,myMongoClient){
    if (error){
        console.log('Connection Failed!')
    }else {
        console.log('Connection Successful.')

        var  productsDb= myMongoClient.db('products');
        var detailsCollec = productsDb.collection('details');
        generateId(myMongoClient,function (id){
           console.log(id);
            var data = { _id: id, name: 'product'+id, price: 500+id};
           insertData(myMongoClient,id,data,detailsCollec);});
    }
});*/

function insertData(myMongoClient,id,productData,collection){

    collection.insertOne(productData,function (error){
        if (error){
            console.log('Insert Failed!')
        }else {
            console.log('Inssert Successful.')
            updateLastProductId(myMongoClient,id);
        }
    });

}

function generateId(MongoClient,callBack){
    var last_product_idDb = MongoClient.db('products');
    var last_product_idCollec = last_product_idDb.collection('last_product_id');
    var findObject = {"_id":1};
    last_product_idCollec.findOne(findObject,function (error,result){
      if (error){
          console.log('failed')
      }else {
          //console.log(result.lastProductId)
          last_product_id = result.lastProductId;
          return callBack(result.lastProductId+1);
      }

    })

}


function updateLastProductId(MongoClient,currectProductId){
    var products = MongoClient.db('products');
    var last_product_id = products.collection('last_product_id');
    var query = {_id : 1};
    var newData = { $set:{ lastProductId : currectProductId}};
    last_product_id.updateOne(query,newData,function (error){
        if (error){
            console.log('LastProductId Update Failed!')
        }else {
            console.log('LastProductId Update Successful.')
        }
    });
}



// git username = kh1amirhamza
// git password = kh/amir7hamza_ !