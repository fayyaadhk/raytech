/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'buying',
        title: 'Buying',
        subtitle: 'Procurement and Fulfillment',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'suppliers',
                title: 'Suppliers',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'suppliers.view',
                        title: 'View All Suppliers',
                        type : 'basic',
                        link : '/suppliers'
                    },
                    {
                        id   : 'suppliers.add',
                        title: 'Add New Supplier',
                        type : 'basic',
                        link : '/suppliers/form'
                    }
                ]            }
        ]
    },
    {
        id   : 'selling',
        title: 'Selling',
        subtitle: 'Quoting and Sales Process',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'clients',
                title: 'Clients',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'clients.view',
                        title: 'View All Clients',
                        type : 'basic',
                        link : '/clients'
                    },
                    {
                        id   : 'clients.add',
                        title: 'Add New Client',
                        type : 'basic',
                        link : '/clients/form'
                    }
                ]
            },
            {
                id   : 'buyers',
                title: 'Buyers',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'buyers.view',
                        title: 'View All Buyers',
                        type : 'basic',
                        link : '/buyers'
                    },
                    {
                        id   : 'buyers.add',
                        title: 'Add New Buyer',
                        type : 'basic',
                        link : '/buyers/add'
                    }
                ]
            },
            {
                id   : 'rfq',
                title: 'RFQs',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'rfqs.view',
                        title: 'View All RFQs',
                        type : 'basic',
                        link : '/rfqs'
                    },
                    {
                        id   : 'rfqs.add',
                        title: 'Add New RFQ',
                        type : 'basic',
                        link : '/rfqs/form'
                    }
                ]
            },
            {
                id   : 'purchase.orders',
                title: 'Purchase Orders',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'po.view',
                        title: 'View All Purchase Orders',
                        type : 'basic',
                        link : '/purchase-orders'
                    },
                    {
                        id   : 'po.add',
                        title: 'Add New Purchase Orders',
                        type : 'basic',
                        link : '/purchase-orders/form'
                    }
                ]
            },
        ]
    },
    {
        id   : 'inventory',
        title: 'Inventory',
        subtitle: 'Stock Management',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'commodities',
                title: 'Commodities',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                link : '/commodities',
                children: [
                    {
                        id   : 'commodities.view',
                        title: 'View Commodities',
                        type : 'basic',
                        link : '/commodities'
                    },
                    {
                        id   : 'commodities.add',
                        title: 'Add New Commodity',
                        type : 'basic',
                        link : '/commodities/form'
                    }
                ]
            },
            {
                id   : 'items',
                title: 'Stock Items',
                type : 'collapsable',
                icon : 'heroicons_outline:archive',
                children: [
                    {
                        id   : 'items.view',
                        title: 'View All Items',
                        type : 'basic',
                        link : '/items'
                    },
                    {
                        id   : 'items.add',
                        title: 'Add New Item',
                        type : 'basic',
                        link : '/items/form'
                    }
                ]
            },
            {
                id   : 'categories',
                title: 'Categories',
                type : 'collapsable',
                icon : 'heroicons_outline:view-grid',
                link : '/categories',
                children: [
                    {
                        id   : 'categories.view',
                        title: 'View Categories',
                        type : 'basic',
                        link : '/categories'
                    },
                    {
                        id   : 'commodities.add',
                        title: 'Add New Category',
                        type : 'basic',
                        link : '/categories/form'
                    }
                ]
            },
        ]
    },

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'buying',
        title: 'Buying',
        subtitle: 'Procurement and Fulfillment',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'suppliers',
                title: 'Suppliers',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'suppliers.view',
                        title: 'View All Suppliers',
                        type : 'basic',
                        link : '/suppliers'
                    },
                    {
                        id   : 'suppliers.add',
                        title: 'Add New Supplier',
                        type : 'basic',
                        link : '/suppliers/form'
                    }
                ]            }
        ]
    },
    {
        id   : 'selling',
        title: 'Selling',
        subtitle: 'Quoting and Sales Process',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'clients',
                title: 'Clients',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'clients.view',
                        title: 'View All Clients',
                        type : 'basic',
                        link : '/clients'
                    },
                    {
                        id   : 'clients.add',
                        title: 'Add New Client',
                        type : 'basic',
                        link : '/clients/form'
                    }
                ]
            },
            {
                id   : 'buyers',
                title: 'Buyers',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'buyers.view',
                        title: 'View All Buyers',
                        type : 'basic',
                        link : '/buyers'
                    },
                    {
                        id   : 'buyers.add',
                        title: 'Add New Buyer',
                        type : 'basic',
                        link : '/buyers/add'
                    }
                ]
            },
            {
                id   : 'rfq',
                title: 'RFQs',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'rfqs.view',
                        title: 'View All RFQs',
                        type : 'basic',
                        link : '/rfqs'
                    },
                    {
                        id   : 'rfqs.add',
                        title: 'Add New RFQ',
                        type : 'basic',
                        link : '/rfqs/form'
                    }
                ]
            },
            {
                id   : 'purchase.orders',
                title: 'Purchase Orders',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'po.view',
                        title: 'View All Purchase Orders',
                        type : 'basic',
                        link : '/purchase-orders'
                    },
                    {
                        id   : 'po.add',
                        title: 'Add New Purchase Orders',
                        type : 'basic',
                        link : '/purchase-orders/form'
                    }
                ]
            },
        ]
    },
    {
        id   : 'inventory',
        title: 'Inventory',
        subtitle: 'Stock Management',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'commodities',
                title: 'Commodities',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                link : '/commodities',
                children: [
                    {
                        id   : 'commodities.view',
                        title: 'View Commodities',
                        type : 'basic',
                        link : '/commodities'
                    },
                    {
                        id   : 'commodities.add',
                        title: 'Add New Commodity',
                        type : 'basic',
                        link : '/commodities/form'
                    }
                ]
            },
            {
                id   : 'items',
                title: 'Stock Items',
                type : 'collapsable',
                icon : 'heroicons_outline:archive',
                children: [
                    {
                        id   : 'items.view',
                        title: 'View All Items',
                        type : 'basic',
                        link : '/items'
                    },
                    {
                        id   : 'items.add',
                        title: 'Add New Item',
                        type : 'basic',
                        link : '/items/form'
                    }
                ]
            },
            {
                id   : 'categories',
                title: 'Categories',
                type : 'collapsable',
                icon : 'heroicons_outline:view-grid',
                link : '/categories',
                children: [
                    {
                        id   : 'categories.view',
                        title: 'View Categories',
                        type : 'basic',
                        link : '/categories'
                    },
                    {
                        id   : 'commodities.add',
                        title: 'Add New Category',
                        type : 'basic',
                        link : '/categories/form'
                    }
                ]
            },
        ]
    },

];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'buying',
        title: 'Buying',
        subtitle: 'Procurement and Fulfillment',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'suppliers',
                title: 'Suppliers',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'suppliers.view',
                        title: 'View All Suppliers',
                        type : 'basic',
                        link : '/suppliers'
                    },
                    {
                        id   : 'suppliers.add',
                        title: 'Add New Supplier',
                        type : 'basic',
                        link : '/suppliers/form'
                    }
                ]            }
        ]
    },
    {
        id   : 'selling',
        title: 'Selling',
        subtitle: 'Quoting and Sales Process',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'clients',
                title: 'Clients',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'clients.view',
                        title: 'View All Clients',
                        type : 'basic',
                        link : '/clients'
                    },
                    {
                        id   : 'clients.add',
                        title: 'Add New Client',
                        type : 'basic',
                        link : '/clients/form'
                    }
                ]
            },
            {
                id   : 'buyers',
                title: 'Buyers',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'buyers.view',
                        title: 'View All Buyers',
                        type : 'basic',
                        link : '/buyers'
                    },
                    {
                        id   : 'buyers.add',
                        title: 'Add New Buyer',
                        type : 'basic',
                        link : '/buyers/add'
                    }
                ]
            },
            {
                id   : 'rfq',
                title: 'RFQs',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'rfqs.view',
                        title: 'View All RFQs',
                        type : 'basic',
                        link : '/rfqs'
                    },
                    {
                        id   : 'rfqs.add',
                        title: 'Add New RFQ',
                        type : 'basic',
                        link : '/rfqs/form'
                    }
                ]
            },
            {
                id   : 'purchase.orders',
                title: 'Purchase Orders',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'po.view',
                        title: 'View All Purchase Orders',
                        type : 'basic',
                        link : '/purchase-orders'
                    },
                    {
                        id   : 'po.add',
                        title: 'Add New Purchase Orders',
                        type : 'basic',
                        link : '/purchase-orders/form'
                    }
                ]
            },
        ]
    },
    {
        id   : 'inventory',
        title: 'Inventory',
        subtitle: 'Stock Management',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'commodities',
                title: 'Commodities',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                link : '/commodities',
                children: [
                    {
                        id   : 'commodities.view',
                        title: 'View Commodities',
                        type : 'basic',
                        link : '/commodities'
                    },
                    {
                        id   : 'commodities.add',
                        title: 'Add New Commodity',
                        type : 'basic',
                        link : '/commodities/form'
                    }
                ]
            },
            {
                id   : 'items',
                title: 'Stock Items',
                type : 'collapsable',
                icon : 'heroicons_outline:archive',
                children: [
                    {
                        id   : 'items.view',
                        title: 'View All Items',
                        type : 'basic',
                        link : '/items'
                    },
                    {
                        id   : 'items.add',
                        title: 'Add New Item',
                        type : 'basic',
                        link : '/items/form'
                    }
                ]
            },
            {
                id   : 'categories',
                title: 'Categories',
                type : 'collapsable',
                icon : 'heroicons_outline:view-grid',
                link : '/categories',
                children: [
                    {
                        id   : 'categories.view',
                        title: 'View Categories',
                        type : 'basic',
                        link : '/categories'
                    },
                    {
                        id   : 'commodities.add',
                        title: 'Add New Category',
                        type : 'basic',
                        link : '/categories/form'
                    }
                ]
            },
        ]
    },

];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'buying',
        title: 'Buying',
        subtitle: 'Procurement and Fulfillment',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'suppliers',
                title: 'Suppliers',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'suppliers.view',
                        title: 'View All Suppliers',
                        type : 'basic',
                        link : '/suppliers'
                    },
                    {
                        id   : 'suppliers.add',
                        title: 'Add New Supplier',
                        type : 'basic',
                        link : '/suppliers/form'
                    }
                ]            }
        ]
    },
    {
        id   : 'selling',
        title: 'Selling',
        subtitle: 'Quoting and Sales Process',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'clients',
                title: 'Clients',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'clients.view',
                        title: 'View All Clients',
                        type : 'basic',
                        link : '/clients'
                    },
                    {
                        id   : 'clients.add',
                        title: 'Add New Client',
                        type : 'basic',
                        link : '/clients/form'
                    }
                ]
            },
            {
                id   : 'buyers',
                title: 'Buyers',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'buyers.view',
                        title: 'View All Buyers',
                        type : 'basic',
                        link : '/buyers'
                    },
                    {
                        id   : 'buyers.add',
                        title: 'Add New Buyer',
                        type : 'basic',
                        link : '/buyers/add'
                    }
                ]
            },
            {
                id   : 'rfq',
                title: 'RFQs',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'rfqs.view',
                        title: 'View All RFQs',
                        type : 'basic',
                        link : '/rfqs'
                    },
                    {
                        id   : 'rfqs.add',
                        title: 'Add New RFQ',
                        type : 'basic',
                        link : '/rfqs/form'
                    }
                ]
            },
            {
                id   : 'purchase.orders',
                title: 'Purchase Orders',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                children: [
                    {
                        id   : 'po.view',
                        title: 'View All Purchase Orders',
                        type : 'basic',
                        link : '/purchase-orders'
                    },
                    {
                        id   : 'po.add',
                        title: 'Add New Purchase Orders',
                        type : 'basic',
                        link : '/purchase-orders/form'
                    }
                ]
            },
        ]
    },
    {
        id   : 'inventory',
        title: 'Inventory',
        subtitle: 'Stock Management',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'commodities',
                title: 'Commodities',
                type : 'collapsable',
                icon : 'heroicons_outline:chart-pie',
                link : '/commodities',
                children: [
                    {
                        id   : 'commodities.view',
                        title: 'View Commodities',
                        type : 'basic',
                        link : '/commodities'
                    },
                    {
                        id   : 'commodities.add',
                        title: 'Add New Commodity',
                        type : 'basic',
                        link : '/commodities/form'
                    }
                ]
            },
            {
                id   : 'items',
                title: 'Stock Items',
                type : 'collapsable',
                icon : 'heroicons_outline:archive',
                children: [
                    {
                        id   : 'items.view',
                        title: 'View All Items',
                        type : 'basic',
                        link : '/items'
                    },
                    {
                        id   : 'items.add',
                        title: 'Add New Item',
                        type : 'basic',
                        link : '/items/form'
                    }
                ]
            },
            {
                id   : 'categories',
                title: 'Categories',
                type : 'collapsable',
                icon : 'heroicons_outline:view-grid',
                link : '/categories',
                children: [
                    {
                        id   : 'categories.view',
                        title: 'View Categories',
                        type : 'basic',
                        link : '/categories'
                    },
                    {
                        id   : 'commodities.add',
                        title: 'Add New Category',
                        type : 'basic',
                        link : '/categories/form'
                    }
                ]
            },
        ]
    },

];
