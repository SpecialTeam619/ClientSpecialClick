import type ymaps3NS from 'ymaps3';

declare global {
    const ymaps3: typeof ymaps3NS;
    interface Window {
        ymaps3: typeof ymaps3NS;
    }
}
