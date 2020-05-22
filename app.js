const error = document.getElementById('error');

class Profile{
   constructor(avatar,profileLink,pRepos,PGists,following,followers,company,website,location,mSince){
        this.avatar = avatar;
        this.profileLink = profileLink;
        this.pRepos = pRepos;
        this.PGists = PGists;
        this.following = following;
        this.followers = followers;
        this.company = company;
        this.website = website;
        this.location = location;
        this.mSince = mSince;
   }
}

class Repos{
    constructor(reposName,stars,watchers,forks,link){
        this.reposName = reposName;
        this.stars = stars;
        this.watchers = watchers;
        this.forks = forks;
        this.link = link;
    }
  }

let profile;

const userInput = document.getElementById('user-input');
userInput.addEventListener('keyup',fetchProfiles);

function fetchProfiles(e){
    const clientId = '0a3619d6b9e59b68660a';
    const clientSecret = 'd1af68bfa805b1a19d8e8bff9b169c4f833944dc';
    const input = e.target.value;
    const reposSort = 'created : asc';
    let profileUrl = `https://api.github.com/users/${input}?client_id=${clientId}&client_secret=${clientSecret}`;
    let reposUrl = `https://api.github.com/users/${input}/repos?client_id=${clientId}&client_secret=${clientSecret}`;
    
    if(input === ''){
        error.style.display = "none";
        document.getElementById('profile-infos').style.display= "none";
        document.querySelector('.latest-repos').style.display= "none";
        document.getElementById('all-repos').style.display= 'none';
    } 

    // profiles fetch //////
    
    fetch(profileUrl).then(response => {
        if(response.ok){
            error.style.display = "none";
            document.getElementById('profile-infos').style.display= "flex";
            document.querySelector('.latest-repos').style.display= "block";
            document.getElementById('all-repos').style.display= 'block';
            return response.json();
                  }
        if(input === ''){
            error.style.display = "none";
            document.getElementById('profile-infos').style.display= "none";
            document.querySelector('.latest-repos').style.display= "none";
            document.getElementById('all-repos').style.display= 'none';
        } else {
            error.style.display = "block";
            document.getElementById('profile-infos').style.display= "none";
            document.querySelector('.latest-repos').style.display= "none";
            document.getElementById('all-repos').style.display= 'none';
        }
    }).then(data => {
        profile = new Profile(
            data.avatar_url, 
            data.html_url, 
            data.public_repos, 
            data.public_gists, 
            data.following, 
            data.followers, 
            data.company, 
            data.blog, 
            data.location, 
            data.created_at
            );

    // UI PART //////////////////////

    output = `
    <div id="profile-photo">
    <div id="image"><img></div>
    <a><button id="view-btn">View Profile</button></a>
</div>
<div id="infos">
    <div id="cards">
            <li style="background-color: green;">Public Repos: <span id="public-repos">0</span></li>
            <li style="background-color: rgb(255, 97, 97);">Public Gists: <span id="public-gists">0</span></li>
            <li style="background-color: rgb(8, 206, 255);">followers: <span id="followers">0</span></li>
            <li style="background-color: rgb(119, 0, 255);">following: <span id="following">0</span></li>
    </div>
    <div id="table">
             <li class="tab" id="fth">Company: <span id="company"></span></li>
             <li class="tab">Website/blog: <span id="website"></span></li>
             <li class="tab">Location: <span id="location"></span></li>
             <li class="tab">Member since: <span id="m-since"></span></li>
    </div>
</div>
             `
    document.getElementById('profile-infos').innerHTML = output;

    const publicRepos = document.getElementById('public-repos');
    const publicGists = document.getElementById('public-gists');
    const followers = document.getElementById('followers');
    const following = document.getElementById('following');

    const company = document.getElementById('company');
    const website = document.getElementById('website');
    const userLocation = document.getElementById('location');
    const memberSince = document.getElementById('m-since');

    const viewProfileBtn = document.getElementById('view-btn');

    viewProfileBtn.addEventListener('click',(e)=>{
        e.target.parentElement.href= `${profile.profileLink}`;
        e.target.parentElement.target= "_blank";
    })
    
    publicRepos.innerText = `${profile.pRepos}`;
    publicGists.innerText = `${profile.PGists}`;
    followers.innerText = `${profile.followers}`;
    following.innerText = `${profile.following}`;

    company.innerText = `${profile.company}`;
    website.innerText = `${profile.website}`;
    userLocation.innerText = `${profile.location}`;
    memberSince.innerText = `${profile.mSince}`;

    const profileImage = document.getElementById('image');

    profileImage.firstChild.src= `${profile.avatar}`;
    
    })

    // repos fetch //////

    fetch(reposUrl).then(response => {
        if(response.ok){
            return response.json();
        }
    }).then(data =>{
        const reposArray = [];
        
        for(let i = 0 ; i < data.length ; i++){
            let repo = new Repos(data[i].name,
                                 data[i].stargazers_count,
                                 data[i].watchers,
                                 data[i].forks,
                                 data[i].html_url
                                );
           reposArray.push(repo)
        }
        
        output = '';
        
        for(let i = 0 ; i < reposArray.length ; i++){
            output+= `
            <div class="repos-container">
            <p id="repos"><a href=${reposArray[i].link} target="_blank">${reposArray[i].reposName}</a></p>
            <ul>
               <li style="background-color: green;">Stars: <span>${reposArray[i].stars}</span></li>
               <li style="background-color: rgb(255, 97, 97);">Watchers: <span>${reposArray[i].watchers}</span></li>
               <li style="background-color: rgb(8, 206, 255);">Forks: <span>${reposArray[i].forks}</span></li>
            </ul>
            </div>
                     `
        }

        document.getElementById('all-repos').innerHTML = output;
        
    })
}

