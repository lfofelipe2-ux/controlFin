module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // Nova funcionalidade
                'fix',      // Correção de bug
                'docs',     // Documentação
                'style',    // Formatação, sem mudança de lógica
                'refactor', // Refatoração de código
                'test',     // Adição ou correção de testes
                'chore',    // Tarefas de manutenção
                'perf',     // Melhoria de performance
                'ci',       // Mudanças em CI/CD
                'build',    // Mudanças em build system
                'revert'    // Reverter commit anterior
            ]
        ],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 100],
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always']
    }
};

