import { nextJsConfig } from '@repo/eslint-config/next-js'

/** @type {import('eslint').Linter.Config} */
export default [
    ...nextJsConfig,
    // importPlugin.flatConfigs.recommended,
    // {
    //     // plugins: {
    //     //     import: importPlugin
    //     // },
    //     rules: {
    //         'import/no-unresolved': 'off',
    //         'import/no-internal-modules': [
    //             'error',
    //             {
    //                 forbid: ['@/modules/*'],
    //             },
    //         ],
    //         //     'no-restricted-imports': [
    //         //         'error',
    //         //         {
    //         //             patterns: ['@/modules/*/*'],
    //         //         },
    //         //     ],
    //     },
    //     settings: {
    //         'import/resolver': {
    //             typescript: {
    //                 alwaysTryTypes: true,
    //                 project: '.',
    //             },
    //         },
    //     },
    // },
]
