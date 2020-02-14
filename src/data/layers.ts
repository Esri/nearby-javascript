import FeatureLayer from 'esri/layers/FeatureLayer';
import { svgSymbol, svgSymbolMap } from '../utils/symbols';

import esri = __esri;

const fields: esri.FieldProperties[] = [
    {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'oid',
    },
    {
        name: 'address',
        alias: 'Address',
        type: 'string',
    },
    {
        name: 'bearing',
        alias: 'Bearing',
        type: 'string',
    },
    {
        name: 'distance',
        alias: 'Distance',
        type: 'double',
    },
    {
        name: 'icon',
        alias: 'Icon',
        type: 'string',
    },
    {
        name: 'name',
        alias: 'Name',
        type: 'string',
    },
    {
        name: 'phone',
        alias: 'Phone',
        type: 'string',
    },
    {
        name: 'url',
        alias: 'Url',
        type: 'string',
    },
    {
        name: 'type',
        alias: 'Type',
        type: 'string',
    },
];

const popupTemplate = {
    title: '{name}',
    content: ({ graphic }: esri.Feature) => {
        const  { address, phone, icon, type, url } = graphic.attributes;
        const ul = document.createElement('ul');
        ul.classList.add('mdc-list', 'nearby-popup-content');
        ul.innerHTML = `
            <li class="mdc-list-item"><span class="mdc-list-item__graphic material-icons" aria-hidden="true">place</span>${address}</li>
            <li class="mdc-list-item"><span class="mdc-list-item__graphic material-icons" aria-hidden="true">phone</span>
                <a href="tel:+1 ${phone}">${phone}</a>
            </li>
            <li class="mdc-list-item"><span class="mdc-list-item__graphic material-icons" aria-hidden="true">public</span>
                <a href="${url}">${url}</a>
            </li>
            <li class="mdc-list-item"><span class="mdc-list-item__graphic material-icons" aria-hidden="true">${icon}</span>${type}</li>
        `
        return ul;
    },
    actions: [
        {
            title: 'Directions to',
            id: 'directions',
            className: 'esri-icon-directions',
        },
    ] as esri.ActionButton[],
};

const renderer: any = {
    type: 'unique-value',
    field: 'icon',
    symbol: svgSymbol('default'),
    uniqueValueInfos: Object.keys(svgSymbolMap).map(infoValue => ({
        value: infoValue,
        symbol: svgSymbol(infoValue),
    })),
};

export const nearbyLayer = new FeatureLayer({
    id: 'nearby-places',
    title: 'Nearby Places',
    geometryType: 'point',
    source: [],
    fields,
    objectIdField: 'OBJECTID',
    outFields: ['*'],
    renderer,
    popupTemplate,
});
