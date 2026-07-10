import { copper, aluminum, glass, gold } from '../utils/materials.js';

export function createSolidStateBattery(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure (aluminum)
    const baseGeom = new THREE.BoxGeometry(2, 0.2, 4);
    const base = new THREE.Mesh(baseGeom, aluminum);
    group.add(base);

    // Solid Electrolyte (glass-like)
    const electrolyteGeom = new THREE.BoxGeometry(1.8, 0.4, 3.8);
    const electrolyte = new THREE.Mesh(electrolyteGeom, glass);
    electrolyte.position.y = 0.3;
    group.add(electrolyte);

    // Electrodes (copper and gold)
    const anodeGeom = new THREE.BoxGeometry(1.6, 0.1, 3.6);
    const anode = new THREE.Mesh(anodeGeom, copper);
    anode.position.y = 0.55;
    anode.name = "anode";
    group.add(anode);
    
    const cathodeGeom = new THREE.BoxGeometry(1.6, 0.1, 3.6);
    const cathode = new THREE.Mesh(cathodeGeom, gold);
    cathode.position.y = 0.05;
    group.add(cathode);

    // Animation: Pulsing energy flow (scaling electrodes slightly to simulate charging/discharging expansion)
    const times = [0, 1, 2];
    const values = [1, 1, 1,  1.05, 1, 1.05,  1, 1, 1];
    
    const track = new THREE.VectorKeyframeTrack('anode.scale', times, values);
    const clip = new THREE.AnimationClip('charge_pulse', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
