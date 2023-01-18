export class CreatePurchaseOrderItemRequest {
    expectedArrivalDate?: string;
    quantity?: null | number;
    priceQuoted?: null | number;
    supplierId?: null | number;
    itemId: number;
    purchaseOrderId: number;
    status?: null | string;
}
