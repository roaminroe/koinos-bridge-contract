import { MockVM, Base58, Arrays, StringBytes, System, Base64 } from "koinos-sdk-as";
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
    ret.push(Base64.decode(signatures[index]));
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

    expect(MockVM.getLogs()).toStrictEqual(['Validators required']);
    MockVM.clearLogs();

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

    expect(MockVM.getLogs()).toStrictEqual(['Validator not unique']);
    MockVM.clearLogs();

    // already initialized
    expect(() => {
      MockVM.setContractId(CONTRACT_ID);
      const b = new Bridge();
      const initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

      b.initialize(initArgs);
      b.initialize(initArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['Contract already initialized']);
    MockVM.clearLogs();
  });

  it('should add support for token #1', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    const signatures = convertSigsToBytes([
      'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
      'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
      'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
      'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
      'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
      'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
    ]);

    const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

    const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);
    b.add_supported_token(addTokenArgs);

    const getTokenArgs = new bridge.get_supported_tokens_arguments(tokenAddr);
    const res = b.get_supported_tokens(getTokenArgs);

    expect(res.addresses.length).toBe(1);
    expect(Arrays.equal(res.addresses[0], tokenAddr)).toBe(true);

    const ev = MockVM.getEvents()[0];
    expect(ev.name).toStrictEqual('bridge.token.added');
    expect(Arrays.equal(ev.impacted[0], tokenAddr)).toBe(true);
  });

  it('should not add support for token', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    MockVM.commitTransaction();

    expect(() => {
      const b = new Bridge();
      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPK');

      const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);
      b.add_supported_token(addTokenArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['16bZDH5igFMJG8BoNMkJVdKsY1yVDB5S5b is not a validator']);
    MockVM.clearLogs();

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

      const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);
      b.add_supported_token(addTokenArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['validator 1MwE1VWBWyRNDWcdgDGNChatXBU73Sc42p already signed']);
    MockVM.clearLogs();

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
      const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);

      b.add_supported_token(addTokenArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['quorum not met']);
    MockVM.clearLogs();

    const signatures = convertSigsToBytes([
      'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
      'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
      'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
      'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
      'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
      'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
    ]);

    const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

    const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);
    b.add_supported_token(addTokenArgs);

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
      const addTokenArgs = new bridge.add_supported_token_arguments(signatures, tokenAddr);

      b.add_supported_token(addTokenArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['Token already exists']);
    MockVM.clearLogs();
  });

  it('should add support for wrapped token #1', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    const signatures = convertSigsToBytes([
      'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
      'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
      'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
      'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
      'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
      'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
    ]);

    const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

    const addTokenArgs = new bridge.add_supported_wrapped_token_arguments(signatures, tokenAddr);
    b.add_supported_wrapped_token(addTokenArgs);

    const getTokenArgs = new bridge.get_supported_wrapped_tokens_arguments(tokenAddr);
    const res = b.get_supported_wrapped_tokens(getTokenArgs);

    expect(res.addresses.length).toBe(1);
    expect(Arrays.equal(res.addresses[0], tokenAddr)).toBe(true);

    const ev = MockVM.getEvents()[0];
    expect(ev.name).toStrictEqual('bridge.wrapped_token.added');
    expect(Arrays.equal(ev.impacted[0], tokenAddr)).toBe(true);
  });

  it('should not add support for wrapped token', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    MockVM.commitTransaction();

    expect(() => {
      const b = new Bridge();
      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPK');

      const addTokenArgs = new bridge.add_supported_wrapped_token_arguments(signatures, tokenAddr);
      b.add_supported_wrapped_token(addTokenArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['16bZDH5igFMJG8BoNMkJVdKsY1yVDB5S5b is not a validator']);
    MockVM.clearLogs();

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

      const addTokenArgs = new bridge.add_supported_wrapped_token_arguments(signatures, tokenAddr);
      b.add_supported_wrapped_token(addTokenArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['validator 1MwE1VWBWyRNDWcdgDGNChatXBU73Sc42p already signed']);
    MockVM.clearLogs();

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
      const addTokenArgs = new bridge.add_supported_wrapped_token_arguments(signatures, tokenAddr);

      b.add_supported_wrapped_token(addTokenArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['quorum not met']);
    MockVM.clearLogs();

    const signatures = convertSigsToBytes([
      'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
      'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
      'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
      'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
      'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
      'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
    ]);

    const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

    const addTokenArgs = new bridge.add_supported_wrapped_token_arguments(signatures, tokenAddr);
    b.add_supported_wrapped_token(addTokenArgs);

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
      ]);

      const tokenAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
      const addTokenArgs = new bridge.add_supported_wrapped_token_arguments(signatures, tokenAddr);

      b.add_supported_wrapped_token(addTokenArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['Token already exists']);
    MockVM.clearLogs();
  });

  it('should add a validator #1', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    const signatures = convertSigsToBytes([
      'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
      'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
      'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
      'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
      'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
      'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
    ]);

    const validatorAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

    const addValidatorArgs = new bridge.add_validator_arguments(signatures, validatorAddr);
    b.add_validator(addValidatorArgs);

    const getValidatorArgs = new bridge.get_validators_arguments(Base58.decode(validatorsAddr[0]));
    const res = b.get_validators(getValidatorArgs);

    expect(res.addresses.length).toBe(9);
    expect(Arrays.equal(res.addresses[1], validatorAddr)).toBe(true);

    const ev = MockVM.getEvents()[0];
    expect(ev.name).toStrictEqual('bridge.validator.added');
    expect(Arrays.equal(ev.impacted[0], validatorAddr)).toBe(true);
  });

  it('should not add a validator', () => {
    const b = new Bridge();
    let initArgs = new bridge.initialize_arguments(validatorsAddrBytes);

    b.initialize(initArgs);

    MockVM.commitTransaction();

    expect(() => {
      const b = new Bridge();
      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
      ]);

      const validatorAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPK');

      const addValidatorArgs = new bridge.add_validator_arguments(signatures, validatorAddr);
      b.add_validator(addValidatorArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['16bZDH5igFMJG8BoNMkJVdKsY1yVDB5S5b is not a validator']);
    MockVM.clearLogs();

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      ]);

      const validatorAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

      const addValidatorArgs = new bridge.add_validator_arguments(signatures, validatorAddr);
      b.add_validator(addValidatorArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['validator 1MwE1VWBWyRNDWcdgDGNChatXBU73Sc42p already signed']);
    MockVM.clearLogs();

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      ]);

      const validatorAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
      const addValidatorArgs = new bridge.add_validator_arguments(signatures, validatorAddr);

      b.add_validator(addValidatorArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['quorum not met']);
    MockVM.clearLogs();

    const signatures = convertSigsToBytes([
      'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
      'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
      'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
      'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
      'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
      'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
      'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
      'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
    ]);

    const validatorAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');

    const addValidatorArgs = new bridge.add_validator_arguments(signatures, validatorAddr);
    b.add_validator(addValidatorArgs);

    expect(() => {
      const b = new Bridge();

      const signatures = convertSigsToBytes([
        'H62y5DwSG3WD4JAVSMXSI79Ofb3GpIr21t/ynStNKO4sbmpoOp2epBsf9IqqzEh4mUDlpJSuqhdEgF9fz1twpyE=',
        'IOamsBSYnnzNQefxUBuXSTKEdOiJHYbFSSwBAQ605XPpFQ8AdgzVrHPOLScOW2a2lsGFT6H48FMT3jh3mkE/fRM=',
        'IPZycDCz3vdboom+zMlN0xJWyTa9B2rrP5ww5OPRWz8nV8rHHKQuKvwecezg9R0lq5Ki66bz34bWEtjq+8kO/p8=',
        'IP3+GI0LVVtvyBTlGq/lShNC2RtOxfJ2mGtIsIrnGFBqcx71RP2v74WiGi/nmqf1dPZ/ygz3Djrw6gce3wwbJbA=',
        'IPi2UTVKy7XdzPzcO6iIHZjCLc+BcMon7yM0qD3Ev4Uqc9ppGEPFIUUZJnn4n3ZSUtvM7VEBzTLznSmKCKLaHc0=',
        'IEANqjWL0YskNlfjd4f8WlgIbelWqvU3OU8yBSHGSCIlFFLe7+cdlU9YFkaE8+EwHgZF6Rc0Jd7czV6CLqiE754=',
        'IFpF6NZqemgwlYb+Y4tAVrqUk7b8Vwaja5rANv0sjN4aZfoJGxZWN3TMfzbWP0IbDecJR6VDLDFE5I4pIhfmmfw=',
        'HwYKdaLwOoj7Yj/X0EtzN9Og9JtEuihOeG+C1sUv+kB2Ycf2q9RfWIBjBgfo5Bs+UMGAlbFL67zLYTW7UBX1YgU='
      ]);

      const validatorAddr = Base58.decode('19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ');
      const addValidatorArgs = new bridge.add_validator_arguments(signatures, validatorAddr);

      b.add_validator(addValidatorArgs);
    }).toThrow();

    expect(MockVM.getLogs()).toStrictEqual(['Validator already exists']);
    MockVM.clearLogs();
  });
});
