import { glass, aluminum, gold } from '../utils/materials.js';

export function createHolographicDataStorageCrystal(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const holderGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const holder = new THREE.Mesh(holderGeo, aluminum);
    holder.position.y = 0.25;
    group.add(holder);

    const crystalGeo = new THREE.BoxGeometry(1, 2, 1);
    const crystal = new THREE.Mesh(crystalGeo, glass);
    crystal.position.y = 1.5;
    crystal.name = 'StorageCrystal';
    group.add(crystal);

    const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(0, 1.5, 2);
    laser.rotation.x = Math.PI / 2;
    laser.name = 'LaserBeam';
    group.add(laser);

    const times = [0, 1, 2];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const rotTrack = new THREE.QuaternionKeyframeTrack('StorageCrystal.quaternion', times, [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray()
    ]);
    
    const pulseTrack = new THREE.NumberKeyframeTrack('LaserBeam.material.opacity', [0, 0.5, 1, 1.5, 2], [0.1, 0.8, 0.1, 0.8, 0.1]);

    const clip = new THREE.AnimationClip('CrystalOperation', 2, [rotTrack, pulseTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
