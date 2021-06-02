"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var cosmos_1 = require("@azure/cosmos");
var endpoint = process.env["ENDPOINT"];
var key = process.env["AzureCosmosDBKey"];
var databaseId = process.env["DATABASE"];
var containerId = process.env["CONTAINER"];
var connectionString = process.env["CONNECTION_STRING"];
// A new CosmosClient object is initialized
//const client = new CosmosClient({ endpoint, key });
var client = new cosmos_1.CosmosClient(connectionString);
//Select the database
var database = client.database(databaseId);
// Select the container
var container = database.container(containerId);
var httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function () {
        var name, responseMessage, querySpec, getItem, items, updatedItem, newItem, createdItem, id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context.log('HTTP trigger function processed a request.');
                    name = (req.query.name || (req.body && req.body.name));
                    responseMessage = name
                        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
                        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
                    querySpec = {
                        query: "Select * from c ORDER BY c.count DESC"
                    };
                    getItem = { id: "0", count: 0 };
                    return [4 /*yield*/, container.items.query(querySpec).fetchAll()];
                case 1:
                    items = (_a.sent()).resources;
                    //context.log(items.length);
                    getItem = items[0];
                    getItem.count = getItem.count + 1;
                    return [4 /*yield*/, container.item(getItem.id).replace(getItem)];
                case 2:
                    updatedItem = (_a.sent()).resource;
                    context.log("Updated item: " + updatedItem.count + " - " + updatedItem.id);
                    newItem = {
                        id: getItem.count + "1",
                        count: "3"
                    };
                    return [4 /*yield*/, container.items.create(newItem)];
                case 3:
                    createdItem = (_a.sent()).resource;
                    context.log("Created item with id : " + createdItem.id);
                    id = getItem.id;
                    return [4 /*yield*/, container.item(getItem.id, getItem.id)["delete"]()];
                case 4:
                    result = (_a.sent()).resource;
                    context.log("Deleted item with id : " + getItem.id);
                    return [2 /*return*/];
            }
        });
    });
};
exports["default"] = httpTrigger;
