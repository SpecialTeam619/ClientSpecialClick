import { useState } from 'react';
import { Basement } from '@widgets';
import {
    YMap,
    YMapDefaultFeaturesLayer,
    YMapDefaultSchemeLayer,
    reactify,
    YMapMarker,
} from '@widgets/map';
import Input from '@shared/ui/Input/Input';
import styles from './style.module.css';
import type { YMapLocationRequest } from 'ymaps3';

function AddressPage() {
    const [address, setAddress] = useState('');

    const LOCATION: YMapLocationRequest = {
        center: [37.588144, 55.733842],
        zoom: 9,
    };

    return (
        <>
            <div className={styles.map}>
                <YMap location={reactify.useDefault(LOCATION)}>
                    <YMapDefaultSchemeLayer />
                    <YMapDefaultFeaturesLayer />

                    <YMapMarker
                        coordinates={reactify.useDefault([
                            37.588144, 55.733842,
                        ])}
                        draggable={true}
                    >
                        <section>
                            <h1>You can drag this header</h1>
                        </section>
                    </YMapMarker>
                </YMap>
            </div>
            <div className={styles.actionWindow}>
                <h1 className={styles.title}>Куда вам доставить технику?</h1>
                <Input
                    placeholder="Введите адрес"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            <Basement to="/cards/filter" />
        </>
    );
}

export default AddressPage;
