import type { IGroupData, IIdentityData, IMerkleProof } from "@cryptkeeperzk/types";

import { ZERO_ADDRESS } from "../const";

export const defaultMerkleProof: IMerkleProof = {
  root: "11390644220109896790698822461687897006579295248439520803064795506754669709244",
  leaf: "1234",
  pathIndices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  siblings: [
    "80877997493538069559805206308114670727110736600665804098123416503841828789",
    "2661044082233456058396187727098375728375921643200540748303695324136976348253",
    "6096293672069786665857538772479257078181838217364432218857495446476026762057",
    "3213387431893684378405765868577693015834376929238162022878266214072895455115",
    "20873329779514886950857383505470593016903620913772324962410074165591568803394",
    "6780943624108258257653151532939766717932945406271650974357241654843472858665",
    "21264138240952572850140232066791887744399569043495230428828286092356682795946",
    "452690015127872896741024235227645852595273621123293637442645322262521332023",
    "2595356927643734846847031846821710482273691477249262580099245601142003997940",
    "8418211123976457425433501316977760560691985592100552826252534497564882890941",
    "1537191400622107328684413318308617657718139563407569116311138837249085215051",
    "19872494822529698336428544644892152939259230790072431463549730793528149292630",
    "16072162194136580487384840145401874130512458959837858730029838869629765668242",
    "2323486562512231983962497291910923278949418891416728247450223252317951409897",
    "11111655209094453582080417077736218640786807288404840495874333175450589148848",
    "13466888144525985340510020716136796993278178506345459094150505308504997365580",
  ],
};

export const mockDefaultIdentityCommitment = "219ea1ec38a6fffb63e2a591fec619fe9dc850d345f6d4d8823a4f72a6f729a6";

export const mockDefaultIdentity: IIdentityData & { secret?: string } = {
  commitment: mockDefaultIdentityCommitment,
  secret: "1234",
  metadata: {
    account: ZERO_ADDRESS,
    name: "Account #1",
    groups: [],
    isDeterministic: true,
    host: "http://localhost:3000",
  },
};

export const mockDefaultGroup: IGroupData = {
  id: "90694543209366256629502773954857",
  name: "Group #1",
};
