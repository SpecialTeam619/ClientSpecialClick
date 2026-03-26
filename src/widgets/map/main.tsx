import React from 'react';
import ReactDom from 'react-dom';

function waitForYmaps(): Promise<typeof ymaps3> {
    return new Promise((resolve) => {
        if (window.ymaps3) {
            resolve(window.ymaps3);
            return;
        }
        const interval = setInterval(() => {
            if (window.ymaps3) {
                clearInterval(interval);
                resolve(window.ymaps3);
            }
        }, 50);
    });
}

const ym = await waitForYmaps();
const [ymaps3React] = await Promise.all([ym.import('@yandex/ymaps3-reactify'), ym.ready]);

export const reactify = ymaps3React.reactify.bindTo(React, ReactDom);
export const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker} = reactify.module(ym);
