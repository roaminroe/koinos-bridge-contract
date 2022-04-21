const { Signer, utils } = require('koilib');
const protobuf = require('protobufjs');
const { sha256 } = require('@noble/hashes/sha256')
const path = require('path');

(async () => {
  const bridgeProto = new protobuf.Root();
  bridgeProto.loadSync(path.join(__dirname, '/../proto/bridge.proto'), { keepCase: true });
  const completeTransferHashProto = bridgeProto.lookupType('bridge.complete_transfer_hash');

  const wif = "5KEX4TMHG66fT7cM9HMZLmdp4hVq4LC4X2Fkg6zeypM5UteWmtd";

  const validators = [];
  const nbValidators = 8;

  for (let index = 0; index < nbValidators; index++) {
    validators[index] = Signer.fromSeed(`validator ${index}`);
    console.log('validator', index, validators[index].getAddress());
  }

  const sign = async (hash) => {
    const signatures = [];
    for (let index = 0; index < validators.length; index++) {
      const validator = validators[index];
      signatures.push(utils.toHexString(await validator.signHash(hash)));
    }

    return signatures;
  };

  const signer = Signer.fromWif(wif);
  /*
    message complete_transfer_hash {
      bytes transaction_id = 1;
      bytes token = 2;
      bytes recipient = 3;
      uint64 amount = 4;
      bytes contract_id = 5;
    }
 */
  const buffer = completeTransferHashProto.encode({
    transaction_id: utils.toUint8Array('0x418bea66a16fc317ece4a3a4815beca64bafc93e99fe56031850593ca9d56f94'),
    token: utils.decodeBase58('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ'),
    recipient: utils.decodeBase58('1GE2JqXw5LMQaU1sj82Dy8ZEe2BRXQS1cs'),
    amount: '123',
    contract_id: utils.decodeBase58('1GE2JqXw5LMQaU1sj82Dy8ZEe2BRXQS1cs')
  }).finish();

  const hash = sha256(buffer);
  const sigs = await sign(hash);

  console.log(sigs)

})();
