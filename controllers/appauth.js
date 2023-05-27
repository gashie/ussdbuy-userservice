const bcyrpt = require("bcrypt");
const { generateApiKey } = require('generate-api-key');
const GlobalModel = require("../model/Global")
const asynHandler = require("../middleware/async");
const Model = require("../model/AppAuth")
const uuidV4 = require('uuid');
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.GetApps = asynHandler(async (req, res, next) => {

    let results = await Model.Fetchall();
    if (results.rows.length == 0) {
        // CatchHistory({ api_response: "No Record Found", function_name: 'GetApps', date_started: systemDate, sql_action: "SELECT", event: "Apps View", actor: req.requesterid }, req)

        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    // CatchHistory({ api_response: `User with ${req.requesterid} viewed ${results.rows.length} apps`, function_name: 'GetApps', date_started: systemDate, sql_action: "SELECT", event: "Apps View", actor: req.requesterid }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})

exports.CreateApp = asynHandler(async (req, res, next) => {
    let id = uuidV4.v4();
    let generatekey = generateApiKey({
        method: 'uuidv5',
        name: req.body.app_name,
        namespace: '0f3819f3-b417-4c4c-b674-853473800265',
        prefix: 'bluespace_app'
    }); // ⇨ 'prod_app.3f7e5d98-3aa9-5dcb-82e3-10d9a2fc412a'
    payload = req.body
    payload.app_key = id
    const salt = await bcyrpt.genSalt(10);
    console.log('generating api key...', generatekey);
    payload.app_secret = await bcyrpt.hash(generatekey, salt);
    let results = await GlobalModel.Create(payload, 'application_auth','id');

    if (results.rowCount == 1) {
        // CatchHistory({ api_response: `New app created`, function_name: 'CreateApp', date_started: systemDate, sql_action: "INSERT", event: "App Setup", actor: requesterid }, req)

        return sendResponse(res, 1, 200, "Record saved", [{ app_key: id, app_secret: generatekey }])
    } else {
        // CatchHistory({ api_response: `Sorry, error saving record for app`, function_name: 'CreateApp', date_started: systemDate, sql_action: "INSERT", event: "User Signup", actor: requesterid }, req)

        return sendResponse(res, 0, 200, "Sorry, error saving record", [])
    }

})