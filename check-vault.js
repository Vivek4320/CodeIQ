const { KeyKing } = require("keyking-sdk");
const vault = process.env.KK_VAULT;
const password = process.env.KK_VAULT_PASS;
if (!vault || !password) {
  console.error("Missing KK_VAULT or KK_VAULT_PASS");
  process.exit(1);
}
const kk = new KeyKing({ vault, password, routingRules: [] });
kk.getProviders().then((p) => {
  console.log("Available providers:", JSON.stringify(p));
}).catch((e) => {
  console.error("Error:", e.message);
});
