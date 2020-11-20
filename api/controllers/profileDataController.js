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

async function repoStuff(repos) {
    let repoArr = [];
    let commits = [];
    for await (const repo of repos) {
        try {
            commits += await theRequest(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits`);
            let repoObj = {
                name: repo.name,
                link: repo.html_url
            };
            repoArr.push(repoObj);
        } catch (err) {
            console.log(err);
        }
    }
    console.log(repoArr);
    return {repoArr, noOfCommits: commits.length};
}

async function getFollowers(followers) {
    let theFollowers = [];
    for await(const follower of followers) {
        console.log(follower.login);
        const repos = await theRequest(`https://api.github.com/users/${follower.login}/repos`);
        let followerObj = {};
        try {
            const repoStuffValues = await repoStuff(repos);
            console.log(repoStuffValues.repoArr);
            const followerDets = await theRequest(`https://api.github.com/users/${follower.login}`);
            followerObj.name = followerDets.name;
            followerObj.email = followerDets.email;
            followerObj.bio = followerDets.bio;
            followerObj.repos = repoStuffValues.repoArr;
            followerObj.noOfCommits = repoStuffValues.noOfCommits;
            console.log(followerObj.repos);
            theFollowers.push(followerObj);
        } catch (err) {
            console.log(err);
        }
    }
    return theFollowers;
}

module.exports = {

    testReq: async function(req) {
        const currentUser = req.user;
        const repos = await theRequest(`https://api.github.com/users/${currentUser.username}/repos`);
        const followers = await theRequest(`https://api.github.com/users/${currentUser.username}/followers`);
        let followersArr = await getFollowers(followers);

        const repoStuffValues = await repoStuff(repos);

        return {
            id: req.user.id,
            name: req.user._json.name,
            bio: req.user._json.bio,
            followers: followersArr,
            repos: [...repoStuffValues.repoArr],
            noOfCommits: repoStuffValues.noOfCommits
        };
        // console.log(req.user.name);
        // return userData;
    }

}


// request(options, (err, res, body) => {})
