const Level = require('./Level');

const canTenant = (tenant, p) => p.tenant === tenant || p.tenant === '*';
const canEntity = (entity, p) => p.entity === entity || p.entity === '*';
const canLevel = (level, p) => p.level >= level;

/**
 * Check if user inside auth can do {method} on {entity}
 * for the tenant inside auth
 * @param {string} method 
 * @param {string} entity 
 * @param {{
 *   user: {
 *     permissions: {
 *       level: number,
 *       entity: string,
 *       tenant: string
 *     }[]
 *   }, tenant: string
 * }} auth 
 * @return {boolean} ability
 */
module.exports = (method, entity, auth) => {
  if(!auth || !auth.user || !auth.user.permissions || !auth.tenant)
    return false;
  const level = Level.fromMethod(method);
  const found = auth.user.permissions
    .filter(p =>
      canTenant(auth.tenant, p) &&
      canEntity(entity, p) &&
      canLevel(level, p)
    );
  return !!found.length;
};
