import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";


const endpoint = process.env["ENDPOINT"];
const key = process.env["AzureCosmosDBKey"];
const databaseId = process.env["DATABASE"];
const containerId = process.env["CONTAINER"];
const connectionString =  process.env["CONNECTION_STRING"];
// A new CosmosClient object is initialized
//const client = new CosmosClient({ endpoint, key });

const client = new CosmosClient(connectionString);
//Select the database

const database = client.database(databaseId);

// Select the container

const container =  database.container(containerId);


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

         const querySpec = {
            query: "Select * from c ORDER BY c.count DESC"
          };
          var getItem =  {id:"0",count:0};

          //Fetch Items from CosmoDB
          const {resources:items} = await container.items.query(querySpec).fetchAll();
          
         
         //context.log(items.length);
         getItem = items[0];
         
         
         getItem.count = getItem.count + 1;
         //context.log(getItem);
         
         //Update Item in CosmoDB
         const {resource : updatedItem}  = await container.item(getItem.id).replace(getItem);
         context.log(`Updated item: ${updatedItem.count} - ${updatedItem.id}`);

         // Create am Item
         const newItem = {
                id: getItem.count+"1",
                count:"3"

         };
         const {resource : createdItem} = await container.items.create(newItem);
         context.log(`Created item with id : ${createdItem.id}`);
         // delete  pass id and partition key
         
         const id = getItem.id;
         const {resource : result} = await container.item(getItem.id,getItem.id).delete();
         context.log(`Deleted item with id : ${getItem.id}`);
        

};

export default httpTrigger;