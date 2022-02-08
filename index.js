/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  // Listen to a branch create event
  // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#create
  app.on("create", async (context) => {
    const { owner, repo } = context.repo()
    const branch = context.payload.ref
    const branchProtectionRules = {
      owner,
      repo,
      branch,
      required_status_checks: {
        strict: true,
        contexts: []
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        dismissal_restrictions: {
          users: [],
          teams: []
        },
        dismiss_stale_reviews: true,
        require_code_owner_reviews: false,
      },
      restrictions: {
        users: [],
        teams: [],
        apps: []
      }
    }
    const issue = {
      owner,
      repo,
      title: `Branch protections rules have been added on ${branch} branch`,
      body: `Hello @shaunaa126, the following branch protection rules are in place for the ${branch} branch on this repository
      - Require a pull request before merging with at least one approver 
      - Dismiss stale reviews
      - Require status checks
      - Require branches to be up to date before merging
      - Enforce branch protection rules on administrators`
    }

    // Update branch protection on main branch for branch type events only
    // Create an issue on the repository notifying of the change
    if (context.payload.ref_type === 'branch' && branch === 'main'){
      try {
        // https://octokit.github.io/rest.js/v18#repos-update-branch-protection
        context.octokit.repos.updateBranchProtection(branchProtectionRules);

        // https://octokit.github.io/rest.js/v18#issues-create
        context.octokit.issues.create(issue);
      }
      catch (err) {
        app.log.error(err)
      }
    }
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
