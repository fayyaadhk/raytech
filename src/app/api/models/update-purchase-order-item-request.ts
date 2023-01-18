export class UpdatePurchaseOrderItemRequest {
    expectedArrivalDate?: string;
    quantity?: null | number;
    priceQuoted?: null | number;
    supplierId?: null | number;
    itemId: number;
    purchaseOrderId: number;
    status?: null | string;
}
