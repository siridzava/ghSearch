// 1. async function to get user from github;
// 5. add custom errors (not found, bad request);
// 2. add function on input to get user name;
// 3. profile markup with user's information;
// 4. error notification;
// 6. reset state functionality;

const searchInput = document.getElementById('search');
const notification = document.getElementById('notification');
const profile = document.querySelector('.profile');

const MIN_NAME_LENGTH = 2;

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }
}

class NotAuthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotAuthenticatedError';
    }
}



async function getUserByUserName(userName) {
  if (!userName || userName.length <= MIN_NAME_LENGTH) {

    return;
  }

  const response = await fetch(`https://api.github.com/users/${userName}?clientId=CLIENT_ID_HERE&clientSecret=CLIENT_SECRET_HERE`);
  const body = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
        throw new NotFoundError(`User (${userName}) not found. Please, check username!`);
    }
    if (response.status === 403) {
        throw new NotAuthenticatedError(`You are not authenticated to make this request!`);
    }

    throw new Error(body.message);
  }

  return body;
}

function renderProfile(user) {
    if (!user) {
        return;
    }

    profile.innerHTML = `
       <div class="card card-body">
        <div class="row">
            <div class="col-md-2">
            <img class="avatar" src="${user.avatar_url}" alt="user's profile image">
            <a class="btn btn-primary link" href="${user.html_url}" target="_blank">View profile</a>
            </div>
            <div class="col-md-10">
            <span class="badge badge-primary">Repositories: ${user.public_repos}</span>
            <span class="badge badge-secondary">Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-warning">Following: ${user.following}</span>
            <br />
            <ul>
                <li>Company: ${user.company}</li>
                <li>Website/Blog: ${user.blog}</li>
                <li>Location: ${user.location}</li>
                <li>Created at: ${user.created_at}</li>
            </ul>
            </div>
        </div>
        </div>
    `;
}

function renderNotification(message, className = 'alert-danger') {
    notification.className = `${notification.className} ${className} show-notification`;
    notification.innerHTML = `<span>${message}</span>`;

    setTimeout(() => {
        notification.className = 'alert custom-notification';
    }, 3000);
}

function clearResult() {
    profile.innerHTML = '';
}

async function fetchProfile(e) {
    const value = e.target.value;

    if (!value) {
        clearResult();
    }

    try {
        const user = await getUserByUserName(value);
        renderProfile(user);
        renderNotification("It looks good! Here is a user's profile", 'alert-success');
    } catch (e) {
        renderNotification(e.message);
        clearResult();
    }
}


searchInput.addEventListener('keyup', fetchProfile);
