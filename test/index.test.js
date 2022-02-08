const nock = require("nock");
// Requiring our app implementation
const myProbotApp = require("..");
const { Probot, ProbotOctokit } = require("probot");
// Requiring our fixtures
const payload = require("./fixtures/branch.created");
//const issueCreatedBody = { body: "Thanks for opening this issue!" };
const issueCreated = {
  owner: `nuistics`,
  repo: `test-stuff`,
  title: `Branch protections rules have been added on main branch`,
  body: `Hello @shaunaa126, the following branch protection rules are in place for the main branch on this repository
  - Require a pull request before merging with at least one approver 
  - Dismiss stale reviews
  - Require status checks
  - Require branches to be up to date before merging
  - Enforce branch protection rules on administrators`
}
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8"
);

describe("My Probot app", () => {
  let probot;

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({
      appId: 123,
      privateKey,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    // Load our app into probot
    probot.load(myProbotApp);
  });

  test("creates an issue when an repository is created", async () => {
    const mock = nock("https://api.github.com")
      // Test that we correctly return a test token
      .post("/app/installations/2/access_tokens")
      .reply(200, {
        token: "test",
        permissions: {
          administration: "write",
          contents: "read",
          issues: "write",
          metadata: "read"
        },
      })

      // Test that a issue is created
      .post("/repos/nuistics/test-stuff/issues/1", (body) => {
        expect(body).toMatchObject(issueCreated);
        return true;
      })
      .reply(200);

    // Receive a webhook event
    await probot.receive({ name: "issues", payload });

    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about testing with Nock see:
// https://github.com/nock/nock
