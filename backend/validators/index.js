const zod = require("zod");
const sign_up_validator = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});
const sign_in_validator = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
const update_validator = zod.object({
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});
module.exports = { sign_up_validator, sign_in_validator, update_validator };
