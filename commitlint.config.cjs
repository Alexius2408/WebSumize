module.exports = {
  extends: ['@commitlint/config-conventional'],

  plugins: [
    {
      rules: {
        'custom-message': ({header}) => {
          const valid = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?!?: .+/;

          if (!valid.test(header)) {
            return [
              false,
              `
Invalid commit message!

Allowed types:
- feat!:    Breaking change          -> new version X.0.0
- feat:     New feature              -> new version x.Y.0
- fix:      Bug fix                  -> new version x.y.Z
- perf:     Performance improvement  -> new version x.y.Z
- style:    Styling changes          -> new version x.y.Z
- docs:     Documentation            (no new version)
- refactor: Code restructure         (no new version)
- test:     Tests                    (no new version)
- build:    Dependencies/build system (no new version)
- ci:       CI/CD changes            (no new version)
- chore:    Misc maintenance         (no new version)
- revert:   Undo a commit            (no new version)

💡 Examples:
- feat: add settings page
- fix: correct alignment
- feat!: change API behavior

Format:
type(scope)!: message
`
            ];
          }

          return [true];
        }
      }
    }
  ],

  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'custom-message': [2, 'always']
  }
};