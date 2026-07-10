import { materials } from '../utils/materials.js';

export function createThreePhaseTransformerCore(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const iron = materials?.iron || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
    const copper = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.3 });
    const redWire = materials?.wireRed || new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const yellowWire = materials?.wireYellow || new THREE.MeshStandardMaterial({ color: 0xcccc00 });
    const blueWire = materials?.wireBlue || new THREE.MeshStandardMaterial({ color: 0x0000cc });
    const fluxMat = materials?.flux || new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 });

    // Core
    const topYoke = new THREE.Mesh(new THREE.BoxGeometry(15, 2, 2), iron);
    topYoke.position.y = 4;
    const bottomYoke = new THREE.Mesh(new THREE.BoxGeometry(15, 2, 2), iron);
    bottomYoke.position.y = -4;
    const limb1 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), iron);
    limb1.position.set(-5, 0, 0);
    const limb2 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), iron);
    limb2.position.set(0, 0, 0);
    const limb3 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), iron);
    limb3.position.set(5, 0, 0);
    group.add(topYoke, bottomYoke, limb1, limb2, limb3);

    // Windings
    const windingGeom = new THREE.CylinderGeometry(2, 2, 5, 16);
    const coil1 = new THREE.Mesh(windingGeom, redWire);
    coil1.position.set(-5, 0, 0);
    const coil2 = new THREE.Mesh(windingGeom, yellowWire);
    coil2.position.set(0, 0, 0);
    const coil3 = new THREE.Mesh(windingGeom, blueWire);
    coil3.position.set(5, 0, 0);
    group.add(coil1, coil2, coil3);

    // Magnetic Flux representation (animated)
    const fluxGeom = new THREE.TorusGeometry(3, 0.2, 8, 32);
    const flux1 = new THREE.Mesh(fluxGeom, fluxMat.clone());
    flux1.position.set(-2.5, 0, 0);
    flux1.scale.set(1, 1.5, 1);
    const flux2 = new THREE.Mesh(fluxGeom, fluxMat.clone());
    flux2.position.set(2.5, 0, 0);
    flux2.scale.set(1, 1.5, 1);
    group.add(flux1, flux2);

    flux1.name = 'Flux1';
    flux2.name = 'Flux2';

    // Animation
    const scaleTrack1 = new THREE.VectorKeyframeTrack('Flux1.scale', [0, 0.5, 1], [1, 1.5, 1, 1.1, 1.6, 1.1, 1, 1.5, 1]);
    const opacityTrack1 = new THREE.NumberKeyframeTrack('Flux1.material.opacity', [0, 0.5, 1], [0.1, 0.5, 0.1]);
    const scaleTrack2 = new THREE.VectorKeyframeTrack('Flux2.scale', [0, 0.5, 1], [1.1, 1.6, 1.1, 1, 1.5, 1, 1.1, 1.6, 1.1]);

    const animClip = new THREE.AnimationClip('TransformerFlux', 1, [scaleTrack1, opacityTrack1, scaleTrack2]);
    animationClips.push(animClip);

    return { group, animationClips };
}
