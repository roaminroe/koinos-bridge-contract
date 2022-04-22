import { MockVM, Base58, Arrays, StringBytes, System } from "koinos-sdk-as";
import { Bridge } from "../Bridge";
import { bridge } from "../proto/bridge";

const CONTRACT_ID = Base58.decode("1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe");

// ordered to ease the unit tests
const validatorsAddr = [
  '17ZLzYQgEJoW5nUpJVueYpfSnzn5CZsUwp',
  '1APSqB9thACzxSL9uL43gqTUYrHYX5JrdA',
  '1ApwoZ7GyCFJSUizrFzwJaSJMvByJyoAgr',
  '1BTG2Xo4EgMMchMSytW3bmyY75Ce54oCaw',
  '1GWSnBFJB1fx2Qotb3nx9b2JL9TFB14e2P',
  '1Dd9qtqWTPGvhKRLhyDvPkNsGPK1qNz6Hk',
  '1MwE1VWBWyRNDWcdgDGNChatXBU73Sc42p',
  '1FTx6dfpvSpyToKmkdAAQsVHW6DsyqSeHZ',
];

const validatorsAddrBytes: Uint8Array[] = [];

validatorsAddr.forEach((valAddr) => {
  validatorsAddrBytes.push(Base58.decode(valAddr));
});

const convertSigsToBytes = (signatures: string[]): Uint8Array[] => {
  const ret: Uint8Array[] = [];

  for (let index = 0; index < signatures.length; index++) {
    ret.push(Arrays.fromHexString(signatures[index]));
  }

  return ret;
};

describe('bridge', () => {
  beforeEach(() => {
    MockVM.reset();
    MockVM.setContractId(CONTRACT_ID);
  });

  it('should initialize bridge', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    const getMetaArgs = new bridge.get_metadata_arguments();
    const metadata = b.get_metadata(getMetaArgs);

    expect(metadata.nb_validators).toBe(8);

    let getValArgs = new bridge.get_validators_arguments(validatorsAddrBytes[0]);
    let res = b.get_validators(getValArgs);

    expect(res.addresses.length).toBe(8);
    for (let index = 0; index < res.addresses.length; index++) {
      const val = res.addresses[index];
      expect(Arrays.equal(val, validatorsAddrBytes[index]));
    }
  });

  it('should not initialize bridge', () => {
    // missing validators
    expect(() => {
      const b = new Bridge();
      const validators: Uint8Array[] = [];

      const initArgs = new bridge.initialize_arguments(validators);

      b.initialize(initArgs);
    }).toThrow();

    let logs = MockVM.getLogs();
    expect(logs[0]).toStrictEqual('Validators required');

    // not unique validators
    expect(() => {
      MockVM.setContractId(CONTRACT_ID);
      const b = new Bridge();
      const validators: Uint8Array[] = [];
      for (let index = 0; index < validatorsAddrBytes.length; index++) {
        validators.push(validatorsAddrBytes[index]);
      }

      validators.push(validatorsAddrBytes[5]);

      const initArgs = new bridge.initialize_arguments(validators);

      b.initialize(initArgs);
    }).toThrow();

    logs = MockVM.getLogs();
    expect(logs[1]).toStrictEqual('Validator not unique');

    // already initialized
    expect(() => {
      MockVM.setContractId(CONTRACT_ID);
      const b = new Bridge();
      const initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

      b.initialize(initArgs);
      b.initialize(initArgs);
    }).toThrow();

    logs = MockVM.getLogs();
    expect(logs[2]).toStrictEqual('Contract already initialized');
  });

  it('should add support for token #1', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    const signatures = convertSigsToBytes([
      '1fadb2e43c121b7583e0901548c5d223bf4e7dbdc6a48af6d6dff29d2b4d28ee2c6e6a683a9d9ea41b1ff48aaacc48789940e5a494aeaa1744805f5fcf5b70a721',
      '20e6a6b014989e7ccd41e7f1501b9749328474e8891d86c5492c01010eb4e573e9150f00760cd5ac73ce2d270e5b66b696c1854fa1f8f05313de38779a413f7d13',
      '20f6727030b3def75ba289beccc94dd31256c936bd076aeb3f9c30e4e3d15b3f2757cac71ca42e2afc1e71ece0f51d25ab92a2eba6f3df86d612d8eafbc90efe9f',
      '20fdfe188d0b555b6fc814e51aafe54a1342d91b4ec5f276986b48b08ae718506a731ef544fdafef85a21a2fe79aa7f574f67fca0cf70e3af0ea071edf0c1b25b0',
      '20f8b651354acbb5ddccfcdc3ba8881d98c22dcf8170ca27ef2334a83dc4bf852a73da691843c52145192679f89f765252dbcced5101cd32f39d298a08a2da1dcd',
      '20400daa358bd18b243657e37787fc5a58086de956aaf537394f320521c64822251452deefe71d954f58164684f3e1301e0645e9173425dedccd5e822ea884ef9e',
      '205a45e8d66a7a68309586fe638b4056ba9493b6fc5706a36b9ac036fd2c8cde1a65fa091b16563774cc7f36d63f421b0de70947a5432c3144e48e292217e699fc',
      '1f060a75a2f03a88fb623fd7d04b7337d3a0f49b44ba284e786f82d6c52ffa407661c7f6abd45f5880630607e8e41b3e50c18095b14bebbccb6135bb5015f56205'
    ]);

    const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

    const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);
    b.add_supported_token(addTokenArgs);

    const getTokenArgs = new bridge.get_supported_tokens_arguments(tokenAddr);
    const res = b.get_supported_tokens(getTokenArgs);

    expect(res.addresses.length).toBe(1);
    expect(Arrays.equal(res.addresses[0], tokenAddr)).toBe(true);

    const ev = MockVM.getEvents();
    expect(ev[0].name).toStrictEqual('bridge.token.added');
    expect(Arrays.equal(ev[0].impacted[0], tokenAddr)).toBe(true);
  });

  it('should not add support for token', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    MockVM.commitTransaction();

    expect(() => {
      const b = new Bridge();
      const signatures = convertSigsToBytes([
        '1fadb2e43c121b7583e0901548c5d223bf4e7dbdc6a48af6d6dff29d2b4d28ee2c6e6a683a9d9ea41b1ff48aaacc48789940e5a494aeaa1744805f5fcf5b70a721',
        '20e6a6b014989e7ccd41e7f1501b9749328474e8891d86c5492c01010eb4e573e9150f00760cd5ac73ce2d270e5b66b696c1854fa1f8f05313de38779a413f7d13',
        '20f6727030b3def75ba289beccc94dd31256c936bd076aeb3f9c30e4e3d15b3f2757cac71ca42e2afc1e71ece0f51d25ab92a2eba6f3df86d612d8eafbc90efe9f',
        '20fdfe188d0b555b6fc814e51aafe54a1342d91b4ec5f276986b48b08ae718506a731ef544fdafef85a21a2fe79aa7f574f67fca0cf70e3af0ea071edf0c1b25b0',
        '20f8b651354acbb5ddccfcdc3ba8881d98c22dcf8170ca27ef2334a83dc4bf852a73da691843c52145192679f89f765252dbcced5101cd32f39d298a08a2da1dcd',
        '20400daa358bd18b243657e37787fc5a58086de956aaf537394f320521c64822251452deefe71d954f58164684f3e1301e0645e9173425dedccd5e822ea884ef9e',
        '205a45e8d66a7a68309586fe638b4056ba9493b6fc5706a36b9ac036fd2c8cde1a65fa091b16563774cc7f36d63f421b0de70947a5432c3144e48e292217e699fc',
        '1f060a75a2f03a88fb623fd7d04b7337d3a0f49b44ba284e786f82d6c52ffa407661c7f6abd45f5880630607e8e41b3e50c18095b14bebbccb6135bb5015f56205'
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPK');

      const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);
      b.add_supported_token(addTokenArgs);
    }).toThrow();

    let logs = MockVM.getLogs();
    expect(logs[0]).toStrictEqual('16bZDH5igFMJG8BoNMkJVdKsY1yVDB5S5b is not a validator');
    MockVM.clearLogs();

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        '1fadb2e43c121b7583e0901548c5d223bf4e7dbdc6a48af6d6dff29d2b4d28ee2c6e6a683a9d9ea41b1ff48aaacc48789940e5a494aeaa1744805f5fcf5b70a721',
        '20e6a6b014989e7ccd41e7f1501b9749328474e8891d86c5492c01010eb4e573e9150f00760cd5ac73ce2d270e5b66b696c1854fa1f8f05313de38779a413f7d13',
        '20f6727030b3def75ba289beccc94dd31256c936bd076aeb3f9c30e4e3d15b3f2757cac71ca42e2afc1e71ece0f51d25ab92a2eba6f3df86d612d8eafbc90efe9f',
        '20fdfe188d0b555b6fc814e51aafe54a1342d91b4ec5f276986b48b08ae718506a731ef544fdafef85a21a2fe79aa7f574f67fca0cf70e3af0ea071edf0c1b25b0',
        '20f8b651354acbb5ddccfcdc3ba8881d98c22dcf8170ca27ef2334a83dc4bf852a73da691843c52145192679f89f765252dbcced5101cd32f39d298a08a2da1dcd',
        '20400daa358bd18b243657e37787fc5a58086de956aaf537394f320521c64822251452deefe71d954f58164684f3e1301e0645e9173425dedccd5e822ea884ef9e',
        '205a45e8d66a7a68309586fe638b4056ba9493b6fc5706a36b9ac036fd2c8cde1a65fa091b16563774cc7f36d63f421b0de70947a5432c3144e48e292217e699fc',
        '205a45e8d66a7a68309586fe638b4056ba9493b6fc5706a36b9ac036fd2c8cde1a65fa091b16563774cc7f36d63f421b0de70947a5432c3144e48e292217e699fc',
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

      const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);
      b.add_supported_token(addTokenArgs);
    }).toThrow();

    logs = MockVM.getLogs();
    expect(logs[0]).toStrictEqual('validator 1MwE1VWBWyRNDWcdgDGNChatXBU73Sc42p already signed');
    MockVM.clearLogs();

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        '1fadb2e43c121b7583e0901548c5d223bf4e7dbdc6a48af6d6dff29d2b4d28ee2c6e6a683a9d9ea41b1ff48aaacc48789940e5a494aeaa1744805f5fcf5b70a721',
        '20e6a6b014989e7ccd41e7f1501b9749328474e8891d86c5492c01010eb4e573e9150f00760cd5ac73ce2d270e5b66b696c1854fa1f8f05313de38779a413f7d13',
        '20f6727030b3def75ba289beccc94dd31256c936bd076aeb3f9c30e4e3d15b3f2757cac71ca42e2afc1e71ece0f51d25ab92a2eba6f3df86d612d8eafbc90efe9f',
        '20fdfe188d0b555b6fc814e51aafe54a1342d91b4ec5f276986b48b08ae718506a731ef544fdafef85a21a2fe79aa7f574f67fca0cf70e3af0ea071edf0c1b25b0',
        '20f8b651354acbb5ddccfcdc3ba8881d98c22dcf8170ca27ef2334a83dc4bf852a73da691843c52145192679f89f765252dbcced5101cd32f39d298a08a2da1dcd',
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
      const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);

      b.add_supported_token(addTokenArgs);
    }).toThrow();

    logs = MockVM.getLogs();
    expect(logs[0]).toStrictEqual('quorum not met');
    MockVM.clearLogs();

    const signatures = convertSigsToBytes([
      '1fadb2e43c121b7583e0901548c5d223bf4e7dbdc6a48af6d6dff29d2b4d28ee2c6e6a683a9d9ea41b1ff48aaacc48789940e5a494aeaa1744805f5fcf5b70a721',
      '20e6a6b014989e7ccd41e7f1501b9749328474e8891d86c5492c01010eb4e573e9150f00760cd5ac73ce2d270e5b66b696c1854fa1f8f05313de38779a413f7d13',
      '20f6727030b3def75ba289beccc94dd31256c936bd076aeb3f9c30e4e3d15b3f2757cac71ca42e2afc1e71ece0f51d25ab92a2eba6f3df86d612d8eafbc90efe9f',
      '20fdfe188d0b555b6fc814e51aafe54a1342d91b4ec5f276986b48b08ae718506a731ef544fdafef85a21a2fe79aa7f574f67fca0cf70e3af0ea071edf0c1b25b0',
      '20f8b651354acbb5ddccfcdc3ba8881d98c22dcf8170ca27ef2334a83dc4bf852a73da691843c52145192679f89f765252dbcced5101cd32f39d298a08a2da1dcd',
      '20400daa358bd18b243657e37787fc5a58086de956aaf537394f320521c64822251452deefe71d954f58164684f3e1301e0645e9173425dedccd5e822ea884ef9e',
      '205a45e8d66a7a68309586fe638b4056ba9493b6fc5706a36b9ac036fd2c8cde1a65fa091b16563774cc7f36d63f421b0de70947a5432c3144e48e292217e699fc',
      '1f060a75a2f03a88fb623fd7d04b7337d3a0f49b44ba284e786f82d6c52ffa407661c7f6abd45f5880630607e8e41b3e50c18095b14bebbccb6135bb5015f56205'
    ]);

    const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

    const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);
    b.add_supported_token(addTokenArgs);

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        '1fadb2e43c121b7583e0901548c5d223bf4e7dbdc6a48af6d6dff29d2b4d28ee2c6e6a683a9d9ea41b1ff48aaacc48789940e5a494aeaa1744805f5fcf5b70a721',
        '20e6a6b014989e7ccd41e7f1501b9749328474e8891d86c5492c01010eb4e573e9150f00760cd5ac73ce2d270e5b66b696c1854fa1f8f05313de38779a413f7d13',
        '20f6727030b3def75ba289beccc94dd31256c936bd076aeb3f9c30e4e3d15b3f2757cac71ca42e2afc1e71ece0f51d25ab92a2eba6f3df86d612d8eafbc90efe9f',
        '20fdfe188d0b555b6fc814e51aafe54a1342d91b4ec5f276986b48b08ae718506a731ef544fdafef85a21a2fe79aa7f574f67fca0cf70e3af0ea071edf0c1b25b0',
        '20f8b651354acbb5ddccfcdc3ba8881d98c22dcf8170ca27ef2334a83dc4bf852a73da691843c52145192679f89f765252dbcced5101cd32f39d298a08a2da1dcd',
        '20400daa358bd18b243657e37787fc5a58086de956aaf537394f320521c64822251452deefe71d954f58164684f3e1301e0645e9173425dedccd5e822ea884ef9e',
        '205a45e8d66a7a68309586fe638b4056ba9493b6fc5706a36b9ac036fd2c8cde1a65fa091b16563774cc7f36d63f421b0de70947a5432c3144e48e292217e699fc',
        '1f060a75a2f03a88fb623fd7d04b7337d3a0f49b44ba284e786f82d6c52ffa407661c7f6abd45f5880630607e8e41b3e50c18095b14bebbccb6135bb5015f56205'
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
      const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);

      b.add_supported_token(addTokenArgs);
    }).toThrow();

    logs = MockVM.getLogs();
    expect(logs[0]).toStrictEqual('Token already exists');
    MockVM.clearLogs();
  });
});
