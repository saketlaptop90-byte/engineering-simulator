import * as sharedMaterials from '../utils/materials.js';

export function createLongwallShearer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const yellowPaint = sharedMaterials.yellowPaint || new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4 });
    const steel = sharedMaterials.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
    const darkMetal = sharedMaterials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

    // AFC (Armored Face Conveyor) Rails - Static Context for the Shearer to ride on
    const railGeo = new THREE.BoxGeometry(2.5, 0.4, 16);
    const rail = new THREE.Mesh(railGeo, darkMetal);
    rail.position.set(0, 0.2, 0);
    group.add(rail);

    // The Shearer unit grouping (used for traversing animation)
    const shearerGroup = new THREE.Group();
    group.add(shearerGroup);

    // Central Control Unit / Main Body
    const bodyGeo = new THREE.BoxGeometry(2, 1.5, 6);
    const body = new THREE.Mesh(bodyGeo, yellowPaint);
    body.position.y = 1.1;
    shearerGroup.add(body);

    // Ranging Arms & Cutting Drums Parameters
    const armGeo = new THREE.BoxGeometry(0.5, 0.5, 3);
    const drumGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    
    // -- Front Assembly --
    const frontArmGroup = new THREE.Group();
    frontArmGroup.position.set(1.2, 1.1, -3);
    shearerGroup.add(frontArmGroup);

    const frontArm = new THREE.Mesh(armGeo, yellowPaint);
    frontArm.position.set(0, 0, -1.5);
    frontArmGroup.add(frontArm);

    const frontDrum = new THREE.Mesh(drumGeo, steel);
    frontDrum.rotation.z = Math.PI / 2;
    frontDrum.position.set(0.5, 0, -3);
    frontArmGroup.add(frontDrum);

    // -- Rear Assembly --
    const rearArmGroup = new THREE.Group();
    rearArmGroup.position.set(1.2, 1.1, 3);
    shearerGroup.add(rearArmGroup);

    const rearArm = new THREE.Mesh(armGeo, yellowPaint);
    rearArm.position.set(0, 0, 1.5);
    rearArmGroup.add(rearArm);

    const rearDrum = new THREE.Mesh(drumGeo, steel);
    rearDrum.rotation.z = Math.PI / 2;
    rearDrum.position.set(0.5, 0, 3);
    rearArmGroup.add(rearDrum);

    // Attach Picks/Bits to Both Drums
    for (let i = 0; i < 16; i++) {
        const bitGeo = new THREE.ConeGeometry(0.08, 0.2, 4);
        const angle = (i / 16) * Math.PI * 2;
        
        const frontBit = new THREE.Mesh(bitGeo, darkMetal);
        frontBit.position.set(0, Math.cos(angle) * 0.85, Math.sin(angle) * 0.85);
        frontBit.rotation.x = -angle; // Pointing outward
        frontDrum.add(frontBit);

        const rearBit = new THREE.Mesh(bitGeo, darkMetal);
        rearBit.position.set(0, Math.cos(angle) * 0.85, Math.sin(angle) * 0.85);
        rearBit.rotation.x = -angle;
        rearDrum.add(rearBit);
    }

    // Animation Configurations
    // Shearer traverses across the coal face
    const slideTrack = new THREE.NumberKeyframeTrack(
        shearerGroup.uuid + '.position[z]',
        [0, 5, 10],
        [-4, 4, -4]
    );

    // Front Arm ranging behavior
    const arm1Track = new THREE.NumberKeyframeTrack(
        frontArmGroup.uuid + '.rotation[x]',
        [0, 2.5, 5, 7.5, 10],
        [0.5, -0.2, 0.5, -0.2, 0.5]
    );

    // Rear Arm opposite ranging behavior
    const arm2Track = new THREE.NumberKeyframeTrack(
        rearArmGroup.uuid + '.rotation[x]',
        [0, 2.5, 5, 7.5, 10],
        [-0.5, 0.2, -0.5, 0.2, -0.5]
    );

    // Constant spinning of the cutting drums
    const drum1Track = new THREE.NumberKeyframeTrack(
        frontDrum.uuid + '.rotation[x]',
        [0, 2, 4, 6, 8, 10],
        [0, Math.PI * 4, Math.PI * 8, Math.PI * 12, Math.PI * 16, Math.PI * 20]
    );

    const drum2Track = new THREE.NumberKeyframeTrack(
        rearDrum.uuid + '.rotation[x]',
        [0, 2, 4, 6, 8, 10],
        [0, Math.PI * 4, Math.PI * 8, Math.PI * 12, Math.PI * 16, Math.PI * 20]
    );

    const clip = new THREE.AnimationClip('ShearerCycle', 10, [
        slideTrack, 
        arm1Track, 
        arm2Track, 
        drum1Track, 
        drum2Track
    ]);
    
    animationClips.push(clip);

    return { group, animationClips };
}
