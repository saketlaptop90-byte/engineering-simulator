import { aluminum, gold, glass } from '../utils/materials.js';

export function createLunarLavaTubeAirlock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tunnel exterior
    const tunnelGeo = new THREE.CylinderGeometry(5, 5, 12, 32, 1, true, 0, Math.PI);
    const tunnel = new THREE.Mesh(tunnelGeo, aluminum);
    tunnel.rotation.z = Math.PI / 2;
    tunnel.position.y = 0;
    group.add(tunnel);

    // Floor
    const floorGeo = new THREE.BoxGeometry(12, 0.5, 10);
    const floor = new THREE.Mesh(floorGeo, aluminum);
    floor.position.y = -0.25;
    group.add(floor);

    // Inner Door
    const doorGeo = new THREE.BoxGeometry(0.5, 4.5, 4);
    const innerDoor = new THREE.Mesh(doorGeo, gold);
    innerDoor.position.set(-4, 2.25, 0);
    group.add(innerDoor);

    // Outer Door
    const outerDoor = new THREE.Mesh(doorGeo, gold);
    outerDoor.position.set(4, 2.25, 0);
    group.add(outerDoor);

    // Control panel
    const panelGeo = new THREE.BoxGeometry(0.5, 1, 1);
    const panel = new THREE.Mesh(panelGeo, glass);
    panel.position.set(3, 2, 2.5);
    group.add(panel);

    // Animation: Doors sliding up and down
    const innerTrack = `${innerDoor.uuid}.position`;
    const outerTrack = `${outerDoor.uuid}.position`;
    const times = [0, 2, 4, 6, 8];
    const innerValues = [-4, 2.25, 0, -4, 6.75, 0, -4, 6.75, 0, -4, 2.25, 0, -4, 2.25, 0];
    const outerValues = [4, 2.25, 0, 4, 2.25, 0, 4, 6.75, 0, 4, 6.75, 0, 4, 2.25, 0];

    const innerKF = new THREE.VectorKeyframeTrack(innerTrack, times, innerValues);
    const outerKF = new THREE.VectorKeyframeTrack(outerTrack, times, outerValues);

    const clip = new THREE.AnimationClip('CycleAirlock', 8, [innerKF, outerKF]);
    animationClips.push(clip);

    return { group, animationClips };
}
