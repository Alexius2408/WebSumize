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
- feat:     New feature
- fix:      Bug fix
- feat!:    Breaking change (triggers a new MAJOR release)
- docs:     Documentation
- style:    Formatting only
- refactor: Code restructure (no feature/fix)
- perf:     Performance improvement
- test:     Tests
- build:    Dependencies/build system
- ci:       CI/CD changes
- chore:    Misc maintenance
- revert:   Undo a commit

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