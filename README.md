# branch-protector

> A GitHub App built with [Probot](https://github.com/probot/probot) that Automatically protect the main branches on newly created repositories

## Getting Started

There are two ways to run this application, directly running it with npm or as a container. 

### NPM - run locally or deploy to a PaaS solution in cloud

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

### Docker - run locally as a container or deploy to a kubernetes instance

```sh
# 1. Build container
docker build -t branch-protector .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> branch-protector
```

### Configure the Github App

To automatically configure your GitHub App, follow these steps:

1. Ensure that the app is running.
2. Next follow instructions to visit http://localhost:3000 (or your custom URL).
3. You should see something like this: 
![Welcome Page](/images/welcomescreen.png)
4. Go ahead and click the Register a GitHub App button.
5. Next, you'll get to decide on an app name that isn't already taken. Note: if you see a message "Name is already in use" although no such app exists, it means that a GitHub organization with that name exists and cannot be used as an app name.
6. After registering your GitHub App, you'll be redirected to install the app on any organization. Select the organization which you want to enforce branch protection policies for all repositories under this organization.
7. Finally you should see something like this to install the Github App:
![Install Page](/images/installgithubapp.png)
At the same time, you can check your local .env and notice it will be populated with values GitHub sends us in the course of that redirect.
8. Restart the service. If you are running locally in your terminal, press ctrl + c to stop the server and run `npm start` again
9. You're all set! Create a repository under the organization where the Github App is installed to see the service in action.
10. You should see branch protection rules applied under repositories `Settings -> Branches -> Branch Protection Rules`. You should also see a new `issue` created in the repository containing the details of the branch protection rules that have been applied.

## Branch Protection Rules
These are the default rules applied by this app.
Check out [octokit](https://octokit.github.io/rest.js/v18#repos-update-branch-protection) for available branch protection options.
```
- Require a pull request before merging with at least one approver 
- Dismiss stale reviews
- Require status checks
- Require branches to be up to date before merging
- Enforce branch protection rules on administrators
```

## Contributing

If you have suggestions for how branch-protector could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2022 Shaun Alexander <shaunalexander@outlook.com>
