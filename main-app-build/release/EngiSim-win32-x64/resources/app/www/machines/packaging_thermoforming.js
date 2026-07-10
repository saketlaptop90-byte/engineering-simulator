import { materials } from '../utils/materials.js';

export function createThermoformingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials?.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.6 });
    const matDark = materials?.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const matBelt = materials?.belt || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const matHeat = materials?.heatElement || new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff2200 });

    // Base
    const baseGeo = new THREE.BoxGeometry(6, 1, 2);
    const base = new THREE.Mesh(baseGeo, matDark);
    base.position.y = 0.5;
    group.add(base);

    // Conveyor
    const conveyorGeo = new THREE.BoxGeometry(6.2, 0.2, 1.8);
    const conveyor = new THREE.Mesh(conveyorGeo, matBelt);
    conveyor.position.y = 1.1;
    group.add(conveyor);

    // Heater Station
    const heaterSupportGeo = new THREE.BoxGeometry(1, 2, 2);
    const heaterSupport = new THREE.Mesh(heaterSupportGeo, matMetal);
    heaterSupport.position.set(-1.5, 2, 0);
    group.add(heaterSupport);

    const heaterGeo = new THREE.BoxGeometry(0.8, 0.2, 1.6);
    const heater = new THREE.Mesh(heaterGeo, matHeat);
    heater.position.set(-1.5, 1.5, 0);
    group.add(heater);

    // Forming Press
    const pressSupportGeo = new THREE.BoxGeometry(1, 2, 2);
    const pressSupport = new THREE.Mesh(pressSupportGeo, matMetal);
    pressSupport.position.set(0.5, 2, 0);
    group.add(pressSupport);

    const pressHeadGeo = new THREE.BoxGeometry(0.8, 0.5, 1.6);
    const pressHead = new THREE.Mesh(pressHeadGeo, matMetal);
    pressHead.position.set(0.5, 2.5, 0);
    pressHead.name = 'FormingPressHead';
    group.add(pressHead);

    // Animations
    const pressTrack = new THREE.VectorKeyframeTrack(
        'FormingPressHead.position',
        [0, 0.5, 1, 1.5, 2],
        [
            0.5, 2.5, 0,
            0.5, 1.2, 0,
            0.5, 1.2, 0,
            0.5, 2.5, 0,
            0.5, 2.5, 0
        ]
    );

    const clip = new THREE.AnimationClip('ThermoformCycle', 2, [pressTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
