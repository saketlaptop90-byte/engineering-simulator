import * as materials from '../utils/materials.js';

export function createHighVoltageIsolatorSwitch(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const steelMaterial = materials.steel || new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.8, roughness: 0.3 });
    const ceramicMaterial = materials.ceramic || new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.1, roughness: 0.8 });
    const copperMaterial = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.2 });

    // Base
    const baseGeo = new THREE.BoxGeometry(6, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, steelMaterial);
    group.add(base);

    // Insulator stacks
    const insulatorGeo = new THREE.CylinderGeometry(0.3, 0.4, 3, 16);
    
    // Left insulator (fixed)
    const leftInsulator = new THREE.Mesh(insulatorGeo, ceramicMaterial);
    leftInsulator.position.set(-2, 1.75, 0);
    group.add(leftInsulator);

    // Right insulator (rotating)
    const rightInsulator = new THREE.Mesh(insulatorGeo, ceramicMaterial);
    rightInsulator.position.set(2, 1.75, 0);
    group.add(rightInsulator);

    // Fixed contact point
    const fixedContactGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const fixedContact = new THREE.Mesh(fixedContactGeo, copperMaterial);
    fixedContact.position.set(-2, 3.5, 0);
    group.add(fixedContact);

    // Moving blade
    const bladeGeo = new THREE.BoxGeometry(4.5, 0.2, 0.4);
    
    // To rotate the blade from one end, we wrap it in a group
    const bladeGroup = new THREE.Group();
    bladeGroup.position.set(2, 3.5, 0); // Pivot point at right insulator
    
    const blade = new THREE.Mesh(bladeGeo, copperMaterial);
    blade.position.set(-2, 0, 0); // Offset so pivot is at the end
    bladeGroup.add(blade);
    
    group.add(bladeGroup);

    // Animation: Switch opening and closing (horizontal break)
    // Rotating around Y axis
    const qClosed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const qOpen = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 3); // 60 degrees open
    
    const switchTrack = new THREE.QuaternionKeyframeTrack(
        bladeGroup.uuid + '.quaternion',
        [0, 1.5, 3, 4.5, 6],
        [...qClosed.toArray(), ...qOpen.toArray(), ...qOpen.toArray(), ...qClosed.toArray(), ...qClosed.toArray()]
    );

    const clip = new THREE.AnimationClip('SwitchOperate', 6, [switchTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
