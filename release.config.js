/* eslint-disable no-template-curly-in-string */
module.exports = {
  plugins: [
    "@semantic-release/github",
    "@semantic-release/npm",
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "docs/CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["docs/CHANGELOG.md", "package.json", "package-lock.json"],
        message:
          "chore(release): ${nextRelease.version}\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "node generateInfo.js ${nextRelease.version}",
      },
    ],
  ],
};
