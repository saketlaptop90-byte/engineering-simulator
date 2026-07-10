import { blackPlastic, aluminum, glass, wood } from '../utils/materials.js';

export function createTwinLensReflex(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeometry = new THREE.BoxGeometry(2, 3, 2);
    const body = new THREE.Mesh(bodyGeometry, blackPlastic);
    group.add(body);

    // Viewing Lens (Top)
    const viewingLensGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
    viewingLensGeom.rotateX(Math.PI / 2);
    const viewingLens = new THREE.Mesh(viewingLensGeom, aluminum);
    viewingLens.position.set(0, 0.8, 1.25);
    group.add(viewingLens);

    const vGlassGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.55, 32);
    vGlassGeom.rotateX(Math.PI / 2);
    const vGlass = new THREE.Mesh(vGlassGeom, glass);
    vGlass.position.copy(viewingLens.position);
    group.add(vGlass);

    // Taking Lens (Bottom)
    const takingLensGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 32);
    takingLensGeom.rotateX(Math.PI / 2);
    const takingLens = new THREE.Mesh(takingLensGeom, aluminum);
    takingLens.position.set(0, -0.2, 1.3);
    group.add(takingLens);

    const tGlassGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.65, 32);
    tGlassGeom.rotateX(Math.PI / 2);
    const tGlass = new THREE.Mesh(tGlassGeom, glass);
    tGlass.position.copy(takingLens.position);
    group.add(tGlass);

    // Film Advance Crank
    const crankGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    crankGeom.rotateZ(Math.PI / 2);
    const crank = new THREE.Mesh(crankGeom, aluminum);
    crank.position.set(1.2, 0, 0);
    group.add(crank);

    // Shutter release button
    const btnGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const btn = new THREE.Mesh(btnGeom, aluminum);
    btn.position.set(-0.8, -0.5, 1.1);
    group.add(btn);

    // Animation: Crank rotating, button pressing
    const crankTrack = new THREE.NumberKeyframeTrack(
        `${crank.uuid}.rotation[x]`,
        [0, 1, 2],
        [0, Math.PI * 2, Math.PI * 4]
    );

    const btnTrack = new THREE.NumberKeyframeTrack(
        `${btn.uuid}.position[z]`,
        [0, 0.1, 0.2, 0.3],
        [1.1, 1.0, 1.0, 1.1]
    );

    const clip = new THREE.AnimationClip('TLROperation', 2, [crankTrack, btnTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
