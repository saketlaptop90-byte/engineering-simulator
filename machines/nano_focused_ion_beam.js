import { materials } from '../utils/materials.js';

export function createFocusedIonBeam(THREE) {
    const group = new THREE.Group();
    group.name = 'FocusedIonBeam';

    // Base chamber
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const chamberMat = materials.metallic || new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8, roughness: 0.2});
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    group.add(chamber);

    // Ion gun
    const gunGeo = new THREE.CylinderGeometry(0.2, 0.5, 3, 16);
    const gunMat = materials.accent || new THREE.MeshStandardMaterial({color: 0x4444ff, metalness: 0.5});
    const gun = new THREE.Mesh(gunGeo, gunMat);
    gun.position.y = 2.5;
    group.add(gun);

    // Beam (pulsing)
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const beamMat = materials.glass || new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 0;
    beam.name = 'IonBeam';
    group.add(beam);

    // Animation (pulsing beam opacity)
    const times = [0, 0.5, 1];
    const values = [0.1, 0.9, 0.1];
    const opacityTrack = new THREE.NumberKeyframeTrack('IonBeam.material.opacity', times, values);
    const clip = new THREE.AnimationClip('PulseBeam', 1, [opacityTrack]);

    return { group, animationClips: [clip] };
}
