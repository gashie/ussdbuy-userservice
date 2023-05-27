const bcrypt = require("bcrypt");
const asynHandler = require("./async");
const AppAuthModel = require("../model/AppAuth")
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");
exports.appauth = asynHandler(async (req, res, next) => {
  let key = req.headers['app-key'];
  let secret = req.headers['app-secret']
  //search for app in db
  const foundApp = await AppAuthModel.auth(key)


  let AppDbInfo = foundApp.rows[0]
  if (!AppDbInfo) {
    // CatchHistory({ pi_response: "Unauthorized access-app not in database", function_name: 'appauth', date_started: systemDate, sql_action: "SELECT", event: "App Authentication", actor: '' }, req)
    return sendResponse(res, 0, 500, 'Unauthorized access to api')

  }
  //is app active ?
  if (!AppDbInfo.app_status) {
    // CatchHistory({ api_response: "Unauthorized access-app exist but not active", function_name: 'appauth', date_started: systemDate, sql_action: "SELECT", event: "App Authentication", actor: '' }, req)
    return sendResponse(res, 0, 500, 'Unauthorized access to api')
  }


  //check for secret
  const match = await bcrypt.compare(secret, AppDbInfo.app_secret)

  if (!match) {
    // CatchHistory({ api_response: "Unauthorized access-app exist but secret does not match", function_name: 'appauth', date_started: systemDate, sql_action: "SELECT", event: "App Authentication", actor: '' }, req)
    return sendResponse(res, 0, 401, 'Unauthorized access to api')
  }


  if (!AppDbInfo.check_ip) {
    req.RequestingAppInfo = AppDbInfo
    return next()
  }

  //check if ip exist
  var arrayOfallowedIps = !AppDbInfo?.allowed_ips ? "" : AppDbInfo?.allowed_ips.split(",");
  var found = arrayOfallowedIps.includes(String('154.160.4.142'));

  if (AppDbInfo.check_ip && !found) {
    // CatchHistory({ api_response: "Unauthorized access-app exist but ip not in db", function_name: 'appauth', date_started: systemDate, sql_action: "SELECT", event: "App Authentication", actor: '' }, req)
    return sendResponse(res, 0, 401, 'Unauthorized access to api')
  }
  if (AppDbInfo.check_ip && found) {
    req.RequestingAppInfo = AppDbInfo
    return next()
  }

});
