// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import localFilenamesPlugin from './eslint-plugins/local-filenames-plugin.mjs';

/**
 * ESLint 9 — flat config (ESM).
 *
 * Bloques:
 * 1. ignores          — exclusiones globales.
 * 2. Base JS          — eslint.configs.recommended.
 * 3. TypeScript       — recommendedTypeChecked (type-aware, usa projectService).
 * 4. SonarJS          — calidad de código (complejidad, duplicados, code smells).
 * 5. Prettier         — eslintPluginPrettierRecommended.
 * 6. Reglas custom    — naming convention, seguridad de tipos.
 * 7. Overrides        — relaja severidad de algunas reglas del preset.
 * 8. Overrides archivo — convenciones de nombres de archivo por tipo NestJS.
 *
 * Convenciones de archivo (eslint-plugins/):
 * - *.controller.ts   → kebab-case.controller.ts
 * - *.service.ts      → kebab-case.service.ts
 * - *.module.ts       → kebab-case.module.ts
 * - *.guard.ts        → kebab-case.guard.ts
 * - *.interceptor.ts  → kebab-case.interceptor.ts
 * - *.filter.ts       → kebab-case.filter.ts
 * - *.decorator.ts    → kebab-case.decorator.ts
 * - *.dto.ts          → kebab-case.dto.ts
 * - *.entity.ts       → kebab-case.entity.ts
 * - *.interface.ts    → kebab-case.interface.ts
 * - *.adapter.ts      → kebab-case.adapter.ts
 * - *.repository.ts   → kebab-case.repository.ts
 * - *.provider.ts     → kebab-case.provider.ts
 * - *.middleware.ts   → kebab-case.middleware.ts
 */
export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'eslint-plugins/**', 'dist', 'node_modules', 'prisma', 'src/migrations', '**/*.spec.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: ['function', 'method'],
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'variable',
          format: ['camelCase'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
        },
        {
          selector: 'classProperty',
          format: ['camelCase'],
        },
        {
          selector: ['enum', 'enumMember'],
          format: ['UPPER_CASE'],
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['off', { endOfLine: 'auto' }],
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },

  // --- Overrides: nombres de archivo por tipo de artefacto NestJS ---
  //
  // Estrategia dual por tipo:
  //   1. Sufijo (*.tipo.ts)          → atrapa archivos con sufijo correcto en cualquier carpeta.
  //   2. Carpeta específica de tipo  → atrapa archivos mal nombrados dentro de la carpeta
  //      (ej: respose-inters.ts en interceptors/ no tiene sufijo .interceptor.ts).
  //
  // NOTA: controller, service y module NO usan patrón por carpeta porque en NestJS
  // las carpetas src/modules/** son namespaces organizacionales, no indican tipo de archivo.

  {
    files: ['**/*.controller.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/controller-filename': 'error' },
  },
  {
    files: ['**/*.service.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/service-filename': 'error' },
  },
  {
    files: ['**/*.module.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/module-filename': 'error' },
  },
  {
    files: ['**/*.guard.ts', '**/guards/**/*.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/guard-filename': 'error' },
  },
  {
    files: ['**/*.interceptor.ts', '**/interceptors/**/*.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/interceptor-filename': 'error' },
  },
  {
    files: ['**/*.filter.ts', '**/filters/**/*.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/filter-filename': 'error' },
  },
  {
    files: ['**/*.decorator.ts', '**/decorators/**/*.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/decorator-filename': 'error' },
  },
  {
    files: ['**/*.dto.ts', '**/dtos/**/*.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/dto-filename': 'error' },
  },
  {
    files: ['**/*.entity.ts', '**/entities/**/*.ts', '**/entity/**/*.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/entity-filename': 'error' },
  },
  {
    files: ['**/*.interface.ts', '**/interfaces/**/*.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/interface-filename': 'error' },
  },
  {
    files: ['**/*.adapter.ts', '**/adapters/**/*.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/adapter-filename': 'error' },
  },
  {
    files: ['**/*.repository.ts', '**/repositories/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/repository-filename': 'error' },
  },
  {
    files: ['**/*.provider.ts', '**/providers/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/provider-filename': 'error' },
  },
  {
    files: ['**/*.middleware.ts', '**/middlewares/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    plugins: { 'local-filenames': localFilenamesPlugin },
    rules: { 'local-filenames/middleware-filename': 'error' },
  },
);
