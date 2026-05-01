/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import ReactDom from 'react-dom';

function waitForYmaps(timeoutMs = 5000): Promise<typeof ymaps3> {
    return new Promise((resolve) => {
        if (window.ymaps3) {
            resolve(window.ymaps3);
            return;
        }

        const timeout = setTimeout(() => {
            clearInterval(interval);
            resolve(undefined as never);
        }, timeoutMs);

        const interval = setInterval(() => {
            if (window.ymaps3) {
                clearTimeout(timeout);
                clearInterval(interval);
                resolve(window.ymaps3);
            }
        }, 50);
    });
}

const FallbackMap = () => null;
type ReactifyLike = { useDefault: <T>(value: T) => T };

const fallbackReactify = {
    useDefault: <T,>(value: T) => value,
};

let reactify: ReactifyLike = fallbackReactify;
let YMap: React.ElementType = FallbackMap;
let YMapDefaultSchemeLayer: React.ElementType = FallbackMap;
let YMapDefaultFeaturesLayer: React.ElementType = FallbackMap;
let YMapMarker: React.ElementType = FallbackMap;

const mapsEnabled = import.meta.env.VITE_ENABLE_YANDEX_MAPS === 'true';

if (mapsEnabled) {
    const ym = await waitForYmaps();

    if (ym) {
        const [ymaps3React] = await Promise.all([
            ym.import('@yandex/ymaps3-reactify'),
            ym.ready,
        ]);

        const liveReactify = ymaps3React.reactify.bindTo(React, ReactDom);
        reactify = {
            useDefault: liveReactify.useDefault.bind(liveReactify),
        };
        const ymapsModule = liveReactify.module(ym);
        YMap = ymapsModule.YMap;
        YMapDefaultSchemeLayer = ymapsModule.YMapDefaultSchemeLayer;
        YMapDefaultFeaturesLayer = ymapsModule.YMapDefaultFeaturesLayer;
        YMapMarker = ymapsModule.YMapMarker;
    }
}

export {
    reactify,
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
};
