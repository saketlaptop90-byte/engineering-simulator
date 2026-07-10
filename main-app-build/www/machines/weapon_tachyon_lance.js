import { darkSteel, titanium, copper, gold } from '../utils/materials.js';

export function createTachyonLance(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Long slender body
    const bodyGeometry = new THREE.BoxGeometry(1, 1, 15);
    const body = new THREE.Mesh(bodyGeometry, titanium);
    group.add(body);

    // Golden accents
    const accentGeom = new THREE.BoxGeometry(1.2, 1.2, 2);
    const accent1 = new THREE.Mesh(accentGeom, gold);
    accent1.position.z = -5;
    accent1.name = 'Accent1';
    group.add(accent1);

    const accent2 = new THREE.Mesh(accentGeom, gold);
    accent2.position.z = 0;
    accent2.name = 'Accent2';
    group.add(accent2);

    const accent3 = new THREE.Mesh(accentGeom, gold);
    accent3.position.z = 5;
    accent3.name = 'Accent3';
    group.add(accent3);

    // Tachyon Beam Emitter
    const emitterGeometry = new THREE.ConeGeometry(0.8, 2, 16);
    const emitter = new THREE.Mesh(emitterGeometry, darkSteel);
    emitter.rotation.x = -Math.PI / 2;
    emitter.position.z = 8.5;
    group.add(emitter);

    // Beam
    const beamGeometry = new THREE.CylinderGeometry(0.2, 0.2, 20, 16);
    const beamMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 8, transparent: true, opacity: 0 });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.x = Math.PI / 2;
    beam.position.z = 19.5;
    beam.name = 'TachyonBeam';
    group.add(beam);

    // Charging animation (accents spinning)
    const rotTrack1 = new THREE.NumberKeyframeTrack('Accent1.rotation[z]', [0, 2], [0, Math.PI * 2]);
    const rotTrack2 = new THREE.NumberKeyframeTrack('Accent2.rotation[z]', [0, 2], [0, -Math.PI * 2]);
    const rotTrack3 = new THREE.NumberKeyframeTrack('Accent3.rotation[z]', [0, 2], [0, Math.PI * 2]);
    const spinClip = new THREE.AnimationClip('ChargingSpin', 2, [rotTrack1, rotTrack2, rotTrack3]);
    animationClips.push(spinClip);

    // Fire animation
    const beamOpacity = new THREE.NumberKeyframeTrack('TachyonBeam.material.opacity', [0, 0.1, 0.3, 0.5], [0, 1, 1, 0]);
    const fireClip = new THREE.AnimationClip('TachyonFire', 0.5, [beamOpacity]);
    animationClips.push(fireClip);

    return { group, animationClips };
}
