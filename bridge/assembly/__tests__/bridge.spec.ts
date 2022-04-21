import { MockVM, Base58, Arrays } from "koinos-sdk-as";
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

    expect(res.validators.length).toBe(8);
    for (let index = 0; index < res.validators.length; index++) {
      const val = res.validators[index];
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

    // not unique validators
    expect(() => {
      const b = new Bridge();
      const validators: Uint8Array[] = [];
      for (let index = 0; index < validatorsAddrBytes.length; index++) {
        validators.push(validatorsAddrBytes[index]);
      }

      validators.push(validatorsAddrBytes[5]);
      
      const initArgs = new bridge.initialize_arguments(validators);
  
      b.initialize(initArgs);
    }).toThrow();

    // already initialized
    expect(() => {
      const b = new Bridge();      
      const initArgs = new bridge.initialize_arguments(validatorsAddrBytes);
  
      b.initialize(initArgs);
      b.initialize(initArgs);
    }).toThrow();
  });
});
