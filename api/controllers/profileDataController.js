const request = require('request-promise');

module.exports = {

    testReq: function(req) {
        return new Promise((resolve, reject) => {
            const requestUrl = "https://api.github.com/user";

            request({
                headers: {
                    'User-Agent': 'GitLeaderboard',
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'token e9099a58cb5ea1a48deb8522260d7f9321d37991'
                },
                url: requestUrl,
                json: true
            }, (err, res, body) => {
                if (err) reject(err);
                resolve(body);
            });
        })



    }

}


// request(options, (err, res, body) => {})
