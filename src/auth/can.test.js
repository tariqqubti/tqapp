const assert = require('assert').strict;
const can = require('./can');
const Level = require('./Level');

const assertCan = (permission, request, expected) => {
  const [pMethod, pEntity, pTenant] = permission.split(' ');
  const [rMethod, rEntity, rTenant] = request.split(' ');
  const pLevel = Level.fromMethod(pMethod);
  const auth = {
    tenant: rTenant,
    user: {
      permissions: [{
        level: pLevel,
        entity: pEntity,
        tenant: pTenant
      }],
    }
  };
  const able = can(rMethod, rEntity, auth);
  assert.equal(
    able, expected,
    `permission: ${permission}, request: ${request}`
  );
};

assertCan('own * *', 'own entity tenant', true);
assertCan('own * tenant', 'own entity tenant', true);
assertCan('remove * tenant', 'own entity tenant', false);
assertCan('own * tenant1', 'own entity tenant2', false);
assertCan('own entity *', 'own entity tenant', true);
assertCan('own * *', 'own * *', true);