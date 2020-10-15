var mongoClient = require('mongodb').MongoClient;
const app = express()

//Middleware...
app.use(express.json())





const url = 'mongodb+srv://ecommerce:ecommerce@cluster0.p4fnz.mongodb.net?retryWrites=true&w=majority';
const config = { useUnifiedTopology: true };


app.post('/addProduct', function (req,res)){
    let productData = req.body;

    mongoClient.connect(url,config,function (err,myMangoClient){
        if (error){
            console.log('Connection Failed!')
        }else {
            var  productsDb= myMongoClient.db('products');
            var detailsCollec = productsDb.collection('details');
            //var myData = { _id: id, name: 'product'+id,price: 200+id};

            generateId(myMongoClient,function (id){
            insertData(myMongoClient,id,productData,detailsCollec);});
        }
    });
}

mongoClient.connect(url,config,function (error,myMongoClient){
    if (error){
        console.log('Connection Failed!')
    }else {

        console.log('Connection Successful.')
        generateId(myMongoClient,function (id){
           console.log(id);
           insertData(myMongoClient,id);});
    }
});

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

