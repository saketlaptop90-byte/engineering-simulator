import { getMaterials } from '../utils/materials.js';

export function createPneumaticFRL(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const mMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const mIron = materials.iron || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.6 });
    const mBrass = materials.brass || new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7, roughness: 0.3 });
    const mGlass = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const mPlastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

    const manifoldGeom = new THREE.BoxGeometry(6, 1, 1);
    const manifold = new THREE.Mesh(manifoldGeom, mIron);
    group.add(manifold);

    const bowlGeom = new THREE.CylinderGeometry(0.6, 0.4, 2, 16);
    const filter = new THREE.Mesh(bowlGeom, mGlass);
    filter.position.set(-2, -1.5, 0);
    group.add(filter);

    const dialGroup = new THREE.Group();
    dialGroup.name = 'dialGroup';
    const dialGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
    const dial = new THREE.Mesh(dialGeom, mPlastic);
    dial.position.set(0, 1, 0);
    dialGroup.add(dial);
    group.add(dialGroup);

    const lubBowl = new THREE.Mesh(bowlGeom, mGlass);
    lubBowl.position.set(2, -1.5, 0);
    group.add(lubBowl);

    const gaugeGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const gauge = new THREE.Mesh(gaugeGeom, mBrass);
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(0, 0.5, 0.6);
    group.add(gauge);

    const needleGroup = new THREE.Group();
    needleGroup.name = 'needleGroup';
    const needleGeom = new THREE.BoxGeometry(0.05, 0.4, 0.05);
    const needle = new THREE.Mesh(needleGeom, mPlastic);
    needle.position.y = 0.2;
    needleGroup.add(needle);
    needleGroup.position.set(0, 0.5, 0.72);
    group.add(needleGroup);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const dialTrack = new THREE.QuaternionKeyframeTrack(`${dialGroup.name}.quaternion`, [0, 2, 4], [...q1.toArray(), ...q2.toArray(), ...q1.toArray()]);

    const n1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const n2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);
    const needleTrack = new THREE.QuaternionKeyframeTrack(`${needleGroup.name}.quaternion`, [0, 2, 4], [...n1.toArray(), ...n2.toArray(), ...n1.toArray()]);

    const clip = new THREE.AnimationClip('RegulatePressure', 4, [dialTrack, needleTrack]);

    return { group, animationClips: [clip] };
}
