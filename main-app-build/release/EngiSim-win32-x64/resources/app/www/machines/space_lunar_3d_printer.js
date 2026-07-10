import { aluminum, gold, glass } from '../utils/materials.js';

export function createLunar3DPrinter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(10, 1, 10);
    const base = new THREE.Mesh(baseGeo, aluminum);
    base.position.y = 0.5;
    group.add(base);

    // Frame
    const frameGeo = new THREE.BoxGeometry(0.5, 8, 0.5);
    const frame1 = new THREE.Mesh(frameGeo, aluminum);
    frame1.position.set(-4.5, 4.5, -4.5);
    group.add(frame1);
    const frame2 = frame1.clone();
    frame2.position.set(4.5, 4.5, -4.5);
    group.add(frame2);
    
    // Gantry
    const gantryGeo = new THREE.BoxGeometry(9.5, 0.5, 1);
    const gantry = new THREE.Mesh(gantryGeo, gold);
    gantry.position.set(0, 8, -4.5);
    group.add(gantry);

    // Print Head (Extruder)
    const headGeo = new THREE.CylinderGeometry(0.5, 0.1, 1, 16);
    const head = new THREE.Mesh(headGeo, glass);
    head.position.set(0, -0.5, 0);
    gantry.add(head);

    // Extruded object (building a dome)
    const domeGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, aluminum);
    dome.position.set(0, 1, 0);
    group.add(dome);

    // Animation: Print head moving back and forth
    const trackName = `${gantry.uuid}.position`;
    const times = [0, 2, 4];
    const values = [-4, 8, -4.5, 4, 8, -4.5, -4, 8, -4.5]; // Moving x
    const positionKF = new THREE.VectorKeyframeTrack(trackName, times, values);
    
    const clip = new THREE.AnimationClip('Extrude', 4, [positionKF]);
    animationClips.push(clip);

    return { group, animationClips };
}
