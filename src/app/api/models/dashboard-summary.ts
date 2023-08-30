import {get} from "lodash";
import {Rfq} from "../../rfq/rfq.model";
import {PurchaseOrder} from "./purchase-order";

export interface DashboardSummary {
    issuedRFQs: Array<Rfq>;
    sourcingRFQs: Array<Rfq>;
    inProgressRFQs: Array<Rfq>;
    pendingSubmissionRFQs: Array<Rfq>;
    closingSoonRFQs: Array<Rfq>;
    issuedPOs: Array<PurchaseOrder>;
    inProgressPOs: Array<PurchaseOrder>;
    pendingDeliveryPOs: Array<PurchaseOrder>;
    invoicedPOs: Array<PurchaseOrder>;
    completedPOs: Array<PurchaseOrder>;
    closingSoonPOs: Array<PurchaseOrder>;
}
