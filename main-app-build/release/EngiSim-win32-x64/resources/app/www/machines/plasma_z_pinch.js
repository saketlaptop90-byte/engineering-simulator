import { copper, darkSteel, gold, aluminum } from '../utils/materials.js';

export function createZPinch(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure
    const baseGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = -5;
    group.add(base);

    // Electrodes
    const electrodeGeo = new THREE.CylinderGeometry(1, 1, 10, 32);
    const topElectrode = new THREE.Mesh(electrodeGeo, copper);
    topElectrode.position.y = 5;
    group.add(topElectrode);

    const bottomElectrode = new THREE.Mesh(electrodeGeo, copper);
    bottomElectrode.position.y = -5;
    group.add(bottomElectrode);

    // Plasma Column (pulsing)
    const plasmaGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const plasmaMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const plasmaColumn = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasmaColumn.name = 'PlasmaColumn';
    group.add(plasmaColumn);

    // Capacitor rings
    const ringGeo = new THREE.TorusGeometry(3, 0.5, 16, 32);
    for (let i = -4; i <= 4; i += 2) {
        const ring = new THREE.Mesh(ringGeo, aluminum);
        ring.position.y = i;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
    }

    // Animation: Pulsing plasma
    const times = [0, 0.5, 1];
    // x, y, z scale values
    const scales = [1, 1, 1, 2.5, 1, 2.5, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack('PlasmaColumn.scale', times, scales);
    const clip = new THREE.AnimationClip('PinchPulse', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
