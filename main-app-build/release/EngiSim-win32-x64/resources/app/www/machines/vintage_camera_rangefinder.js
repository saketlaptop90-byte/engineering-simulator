import { blackPlastic, aluminum, glass, wood } from '../utils/materials.js';

export function createRangefinderMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Camera Body
    const bodyGeom = new THREE.BoxGeometry(3, 1.8, 1);
    const body = new THREE.Mesh(bodyGeom, aluminum);
    group.add(body);
    
    const gripGeom = new THREE.BoxGeometry(3.05, 1.2, 1.05);
    const grip = new THREE.Mesh(gripGeom, blackPlastic);
    grip.position.set(0, -0.3, 0);
    group.add(grip);

    // Lens
    const lensGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32);
    lensGeom.rotateX(Math.PI / 2);
    const lens = new THREE.Mesh(lensGeom, aluminum);
    lens.position.set(0, -0.1, 0.9);
    group.add(lens);

    const glassGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.85, 32);
    glassGeom.rotateX(Math.PI / 2);
    const lensGlass = new THREE.Mesh(glassGeom, glass);
    lensGlass.position.set(0, -0.1, 0.9);
    group.add(lensGlass);

    // Focus Ring
    const focusRingGeom = new THREE.CylinderGeometry(0.62, 0.62, 0.3, 32);
    focusRingGeom.rotateX(Math.PI / 2);
    const focusRing = new THREE.Mesh(focusRingGeom, blackPlastic);
    focusRing.position.set(0, -0.1, 1.1);
    group.add(focusRing);

    // Rangefinder Windows
    const win1Geom = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const window1 = new THREE.Mesh(win1Geom, glass);
    window1.position.set(-1.2, 0.6, 0.55);
    group.add(window1);

    const win2Geom = new THREE.BoxGeometry(0.2, 0.2, 0.1);
    const window2 = new THREE.Mesh(win2Geom, glass);
    window2.position.set(1.0, 0.6, 0.55);
    group.add(window2);

    // Rangefinder Arm (Internal logic represented by an external indicator for viz)
    const armGeom = new THREE.BoxGeometry(0.05, 0.4, 0.05);
    const arm = new THREE.Mesh(armGeom, aluminum);
    arm.position.set(0.8, 0.6, 0.5);
    group.add(arm);

    // Animation: Focus ring rotating and rangefinder arm moving
    const times = [0, 1.5, 3];
    const ringRot = [0, Math.PI / 2, 0];
    const armPos = [0.8, 0.9, 0.8];

    const ringTrack = new THREE.NumberKeyframeTrack(`${focusRing.uuid}.rotation[z]`, times, ringRot);
    const armTrack = new THREE.NumberKeyframeTrack(`${arm.uuid}.position[x]`, times, armPos);

    const clip = new THREE.AnimationClip('RangefinderFocus', 3, [ringTrack, armTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
