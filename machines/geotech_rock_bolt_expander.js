import * as mats from '../utils/materials.js';

export function createRockBoltExpander(THREE) {
    const group = new THREE.Group();
    group.name = 'RockBoltExpander';
    
    // Bolt shaft
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 5, 16);
    const shaft = new THREE.Mesh(shaftGeo, mats.steel);
    shaft.position.y = 2.5;
    group.add(shaft);

    // Nut & Plate
    const plateGeo = new THREE.BoxGeometry(0.8, 0.05, 0.8);
    const plate = new THREE.Mesh(plateGeo, mats.darkSteel);
    plate.position.y = 0.025;
    group.add(plate);

    const nutGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 6);
    const nut = new THREE.Mesh(nutGeo, mats.chrome);
    nut.position.y = 0.15;
    nut.name = 'BoltNut';
    group.add(nut);

    // Expanding Shells
    const shell1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.3), mats.castIron);
    shell1.position.set(0.15, 4.5, 0);
    shell1.name = 'ExpShell1';
    group.add(shell1);

    const shell2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.3), mats.castIron);
    shell2.position.set(-0.15, 4.5, 0);
    shell2.name = 'ExpShell2';
    group.add(shell2);

    // Animation: Nut rotates, shells expand outward
    const times = [0, 2];
    
    // Nut rotation
    const nutRotStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0));
    const nutRotEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 4, 0));
    const nutTrack = new THREE.QuaternionKeyframeTrack('BoltNut.quaternion', times, [
        nutRotStart.x, nutRotStart.y, nutRotStart.z, nutRotStart.w,
        nutRotEnd.x, nutRotEnd.y, nutRotEnd.z, nutRotEnd.w
    ]);

    // Shell expansion
    const shell1Track = new THREE.VectorKeyframeTrack('ExpShell1.position', times, [
        0.15, 4.5, 0,
        0.3, 4.5, 0
    ]);
    const shell2Track = new THREE.VectorKeyframeTrack('ExpShell2.position', times, [
        -0.15, 4.5, 0,
        -0.3, 4.5, 0
    ]);

    const clip = new THREE.AnimationClip('ExpandBolt', 2.0, [nutTrack, shell1Track, shell2Track]);

    return { group, animationClips: [clip] };
}
