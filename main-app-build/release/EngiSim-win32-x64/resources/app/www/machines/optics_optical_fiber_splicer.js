import { materials } from '../utils/materials.js';

export function createOpticalFiberSplicer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Machine
    const baseGeo = new THREE.BoxGeometry(6, 2, 4);
    const base = new THREE.Mesh(baseGeo, materials.lightMetal || materials.metallic);
    base.position.y = 1;
    group.add(base);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(2, 1.5);
    const screenMat = new THREE.MeshBasicMaterial({color: 0x001133});
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.5, 1.5);
    screen.rotation.x = -Math.PI / 6;
    group.add(screen);

    // V-grooves for fibers
    const grooveGeo = new THREE.BoxGeometry(1, 0.2, 0.5);
    const grooveL = new THREE.Mesh(grooveGeo, materials.darkMetal);
    grooveL.position.set(-1.5, 2.1, 0);
    group.add(grooveL);
    
    const grooveR = new THREE.Mesh(grooveGeo, materials.darkMetal);
    grooveR.position.set(1.5, 2.1, 0);
    group.add(grooveR);

    // Fibers
    const fiberGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
    const fiberL = new THREE.Mesh(fiberGeo, materials.glass);
    fiberL.rotation.z = Math.PI / 2;
    fiberL.position.set(-2, 2.2, 0);
    fiberL.name = 'FiberL';
    group.add(fiberL);

    const fiberR = new THREE.Mesh(fiberGeo, materials.glass);
    fiberR.rotation.z = Math.PI / 2;
    fiberR.position.set(2, 2.2, 0);
    fiberR.name = 'FiberR';
    group.add(fiberR);

    // Electrodes
    const electrodeGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.5);
    const electrodeFront = new THREE.Mesh(electrodeGeo, materials.metallic);
    electrodeFront.rotation.x = Math.PI / 2;
    electrodeFront.position.set(0, 2.2, 0.3);
    group.add(electrodeFront);

    const electrodeBack = new THREE.Mesh(electrodeGeo, materials.metallic);
    electrodeBack.rotation.x = -Math.PI / 2;
    electrodeBack.position.set(0, 2.2, -0.3);
    group.add(electrodeBack);

    // Arc discharge
    const arcGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const arcMat = materials.laserLight ? materials.laserLight.clone() : new THREE.MeshBasicMaterial({color: 0xaaaaff, transparent: true, opacity: 0});
    arcMat.transparent = true;
    arcMat.opacity = 0; // start hidden
    const arc = new THREE.Mesh(arcGeo, arcMat);
    arc.position.set(0, 2.2, 0);
    arc.name = 'ArcDischarge';
    group.add(arc);

    // Animation: Fibers move together, arc flashes, fibers fuse
    const fiberLTrack = new THREE.VectorKeyframeTrack('FiberL.position', [0, 1, 3], [
        -2, 2.2, 0,
        -1.5, 2.2, 0,
        -1.5, 2.2, 0
    ]);
    const fiberRTrack = new THREE.VectorKeyframeTrack('FiberR.position', [0, 1, 3], [
        2, 2.2, 0,
        1.5, 2.2, 0,
        1.5, 2.2, 0
    ]);
    
    const arcTrack = new THREE.NumberKeyframeTrack('ArcDischarge.material.opacity', [0, 1, 1.2, 1.4, 1.6, 2, 3], [
        0, 0, 1, 0, 1, 0, 0
    ]);

    const clip = new THREE.AnimationClip('SplicingProcess', 3, [fiberLTrack, fiberRTrack, arcTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
