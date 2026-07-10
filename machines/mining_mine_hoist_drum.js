import { materials } from '../utils/materials.js';

export function createMineHoistDrum(THREE) {
    const group = new THREE.Group();
    group.name = "MineHoistDrumGroup";

    const getMat = (name, color) => (materials && materials[name]) || new THREE.MeshStandardMaterial({color});
    const drumMat = getMat('metalDark', 0x333333);
    const supportMat = getMat('paintYellow', 0xeeba30);
    const cableMat = getMat('steelCable', 0x999999);

    // Base supports
    const supportGeo = new THREE.BoxGeometry(2, 6, 8);
    const support1 = new THREE.Mesh(supportGeo, supportMat);
    support1.position.set(-6, -3, 0);
    group.add(support1);

    const support2 = new THREE.Mesh(supportGeo, supportMat);
    support2.position.set(6, -3, 0);
    group.add(support2);

    // Drum Assembly
    const drumGroup = new THREE.Group();
    drumGroup.name = "HoistDrum";
    group.add(drumGroup);

    // Main cylinder
    const drumGeo = new THREE.CylinderGeometry(5, 5, 10, 64);
    const drum = new THREE.Mesh(drumGeo, drumMat);
    drum.rotation.z = Math.PI / 2;
    drumGroup.add(drum);

    // Flanges
    const flangeGeo = new THREE.CylinderGeometry(5.5, 5.5, 0.4, 64);
    const flange1 = new THREE.Mesh(flangeGeo, supportMat);
    flange1.rotation.z = Math.PI / 2;
    flange1.position.set(-5, 0, 0);
    drumGroup.add(flange1);

    const flange2 = new THREE.Mesh(flangeGeo, supportMat);
    flange2.rotation.z = Math.PI / 2;
    flange2.position.set(5, 0, 0);
    drumGroup.add(flange2);

    // Cables (visual representation as textured rings or spirals)
    const cableGeo = new THREE.TorusGeometry(5.05, 0.1, 8, 64);
    for(let i=0; i<40; i++) {
        const ring = new THREE.Mesh(cableGeo, cableMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(-4.5 + (i * 0.22), 0, 0);
        drumGroup.add(ring);
    }

    // Central Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.8, 0.8, 14, 16);
    const shaft = new THREE.Mesh(shaftGeo, drumMat);
    shaft.rotation.z = Math.PI / 2;
    drumGroup.add(shaft);

    // Animation
    const times = [0, 4, 8];
    const xAxis = new THREE.Vector3(1, 0, 0); // DrumGroup revolves around X axis
    const values = [
        ...new THREE.Quaternion().setFromAxisAngle(xAxis, 0).toArray(),
        ...new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI).toArray(),
        ...new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 2).toArray()
    ];
    const track = new THREE.QuaternionKeyframeTrack('HoistDrum.quaternion', times, values);
    const clip = new THREE.AnimationClip('HoistOperation', 8, [track]);

    return { group, animationClips: [clip] };
}
