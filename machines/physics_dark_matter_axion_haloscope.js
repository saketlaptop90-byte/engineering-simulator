import { titanium, copper, gold, darkSteel } from '../utils/materials.js';

export function createDarkMatterAxionHaloscope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Dilution Refrigerator Body
    const fridgeGeo = new THREE.CylinderGeometry(2, 2, 12, 32);
    const fridge = new THREE.Mesh(fridgeGeo, darkSteel);
    group.add(fridge);

    // Microwave Cavity
    const cavityGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    const cavity = new THREE.Mesh(cavityGeo, copper);
    cavity.position.y = -2;
    group.add(cavity);

    // Tuning Rods
    const rodGroup = new THREE.Group();
    rodGroup.name = 'tuningRods';
    const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const rod1 = new THREE.Mesh(rodGeo, titanium);
    rod1.position.set(0.5, 0, 0);
    const rod2 = new THREE.Mesh(rodGeo, titanium);
    rod2.position.set(-0.5, 0, 0);
    rodGroup.add(rod1);
    rodGroup.add(rod2);
    rodGroup.position.y = -2;
    group.add(rodGroup);

    // Superconducting Solenoid
    const solenoidGeo = new THREE.CylinderGeometry(1.2, 1.4, 6, 32, 1, true);
    const solenoidMat = new THREE.MeshStandardMaterial({ color: 0x7777aa, wireframe: true });
    const solenoid = new THREE.Mesh(solenoidGeo, solenoidMat);
    solenoid.position.y = -2;
    group.add(solenoid);

    // Axion Conversion Photon Flash
    const flashGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.name = 'axionFlash';
    flash.position.y = -2;
    flash.scale.set(0.01, 0.01, 0.01);
    group.add(flash);

    // Animation: Tuning rods rotating, occasional photon flash
    const times = [0, 2, 4];
    const rodRot = [0, 0, 0,  0, Math.PI, 0,  0, Math.PI * 2, 0];
    const rodTrack = new THREE.VectorKeyframeTrack('tuningRods.rotation', times, rodRot);

    // Flash scale animating
    const fTimes = [0, 1.9, 2.0, 2.1, 4];
    const fScale = [
        0.01, 0.01, 0.01,
        0.01, 0.01, 0.01,
        2, 2, 2,
        0.01, 0.01, 0.01,
        0.01, 0.01, 0.01
    ];
    const flashTrack = new THREE.VectorKeyframeTrack('axionFlash.scale', fTimes, fScale);

    const clip = new THREE.AnimationClip('SearchAxions', 4, [rodTrack, flashTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
