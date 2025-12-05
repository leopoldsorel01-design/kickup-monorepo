import { buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import { join } from 'path';
import { test } from 'node:test';
import assert from 'node:assert';

test('GraphQL Schema should be valid', () => {
    const indexContent = readFileSync(join(__dirname, 'index.ts'), 'utf-8');
    const typeDefsMatch = indexContent.match(/const typeDefs = `#graphql([\s\S]*?)`;/);

    if (!typeDefsMatch) {
        throw new Error('Could not find typeDefs in index.ts');
    }

    const typeDefs = typeDefsMatch[1];

    try {
        buildSchema(typeDefs);
    } catch (error: any) {
        assert.fail(`Schema validation failed: ${error.message}`);
    }
});
