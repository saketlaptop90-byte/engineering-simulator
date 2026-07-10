import { materials } from '../utils/materials.js';

export function createCellTowerAntenna(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = (materials && materials.metal) || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const panelMat = (materials && materials.plastic) || new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const lightMat = (materials && materials.emissiveRed) || new THREE.MeshStandardMaterial({ emissive: 0xff0000, emissiveIntensity: 1, color: 0x000000 });

    const poleGeo = new THREE.CylinderGeometry(0.3, 0.5, 10, 16);
    const pole = new THREE.Mesh(poleGeo, metalMat);
    group.add(pole);

    const platformGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16);
    const platform = new THREE.Mesh(platformGeo, metalMat);
    platform.position.y = 3;
    group.add(platform);

    for (let i=0; i<3; i++) {
        const panelGroup = new THREE.Group();
        const panelGeo = new THREE.BoxGeometry(0.5, 3, 0.2);
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.z = 1.2;
        panelGroup.add(panel);
        panelGroup.rotation.y = (Math.PI * 2 / 3) * i;
        panelGroup.position.y = 4;
        group.add(panelGroup);
    }

    const beaconGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const beacon = new THREE.Mesh(beaconGeo, lightMat);
    beacon.position.y = 5.2;
    beacon.name = 'beaconLight';
    group.add(beacon);

    const times = [0, 0.5, 1];
    const values = [1, 0, 1];
    const track = new THREE.NumberKeyframeTrack(`${beacon.name}.material.emissiveIntensity`, times, values);
    const clip = new THREE.AnimationClip('Blink', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
