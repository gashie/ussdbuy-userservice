const pool = require("../config/db");
const { logger } = require("../logs/winston");

let bluespacedb = {};
bluespacedb.Fetchall = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM application_auth ORDER BY created_at DESC", (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        }); az
    });
};
bluespacedb.auth = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM application_auth WHERE app_key = $1", [id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};


module.exports = bluespacedb