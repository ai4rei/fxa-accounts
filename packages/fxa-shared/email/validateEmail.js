const dns = require('dns');
const resolver = new dns.promises.Resolver();
const NotFoundErrorCodes = require('./emailValidatorErrors').NotFoundErrorCodes;

export const results = ['MX', 'A', 'none', 'skip'].reduce(
  (accumulator, val) => {
    accumulator[val] = val;
    return accumulator;
  },
  {}
);

const tryResolveWith = (resolveFunc) => async (domain) => {
  try {
    const records = await resolveFunc(domain);
    // We don't do anything with the records
    return records && records.length;
  } catch (err) {
    if (NotFoundErrorCodes.includes(err.code)) {
      return false;
    }
    throw err;
  }
};

export const tryResolveMx = async (domain) => {
  return await tryResolveWith(resolver.resolveMx.bind(resolver))(domain);
};

export const tryResolveIpv4 = async (domain) => {
  return await tryResolveWith(resolver.resolve4.bind(resolver))(domain);
};
