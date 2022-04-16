import { MockVM, Base58 } from "koinos-sdk-as";
import { Bridge } from "../Bridge";
import * as bridge from "../proto/bridge";

const CONTRACT_ID = Base58.decode("1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe");

describe("bridge", () => {
  beforeEach(() => {
    MockVM.reset();
    MockVM.setContractId(CONTRACT_ID);
  });

  it("TODO", () => {
    const bridge = new Bridge();

    expect(true).toBe(true);
  });
});
