const request = require('request-promise');

function theRequest(url) {
    return new Promise((resolve, reject) => {

        // const requestUrl = `https://api.github.com/users/${currentUser.username}/repos`;
        // console.log('current user is: ' + req.user.username);

        request({
            headers: {
                'User-Agent': 'GitLeaderboard',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token e9099a58cb5ea1a48deb8522260d7f9321d37991'
            },
            url: url,
            json: true
        }, (err, res, body) => {
            if (err) reject(err);
            // console.log(body);
            resolve(body);
        });
    });
}

module.exports = {

    testReq: async function(req) {
        const currentUser = req.user;
        const repos = await theRequest(`https://api.github.com/users/${currentUser.username}/repos`);
        // let noOfCommits;
        let commits = [];
        for (const repo of repos) {
            commits += await theRequest(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits`);
        }

        const userData = {
            name: req.user.name,
            id: req.user.id,
            followers: await theRequest(`https://api.github.com/users/${currentUser.username}/followers`),
            noOfCommits: commits.length
        };
        return userData;
    }

}


// request(options, (err, res, body) => {})
