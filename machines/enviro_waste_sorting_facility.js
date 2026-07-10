import * as materials from '../utils/materials.js';

export function createAutomatedWasteSortingFacility(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Conveyor Belt
    const beltGeo = new THREE.BoxGeometry(12, 0.2, 2);
    const beltMat = materials.rubberMaterial || new THREE.MeshStandardMaterial({ color: 0x111111 });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.set(0, 1, 0);
    group.add(belt);

    // Sorting Robotic Arms
    const armGeo = new THREE.BoxGeometry(0.5, 3, 0.5);
    const armMat = materials.robotMaterial || new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    
    for (let i = 0; i < 3; i++) {
        const armPivot = new THREE.Group();
        armPivot.position.set(-3 + i * 3, 1, 1.5);
        
        const arm = new THREE.Mesh(armGeo, armMat);
        arm.position.set(0, 1.5, 0);
        armPivot.add(arm);
        
        armPivot.name = `sortingArm_${i}`;
        group.add(armPivot);

        // Animation for arm pivoting
        const armTrack = new THREE.QuaternionKeyframeTrack(
            `${armPivot.name}.quaternion`,
            [0, 0.5, 1, 1.5],
            [
                new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
                new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/4).toArray(),
                new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
                new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/4).toArray()
            ].flat()
        );
        const clip = new THREE.AnimationClip(`ArmAction_${i}`, 1.5, [armTrack]);
        animationClips.push(clip);
    }

    // Waste Items (Boxes)
    const wasteGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const waste1 = new THREE.Mesh(wasteGeo, materials.wastePlastic || new THREE.MeshStandardMaterial({ color: 0x0000ff }));
    waste1.name = 'waste1';
    group.add(waste1);

    const wasteTrack = new THREE.VectorKeyframeTrack(
        'waste1.position',
        [0, 2],
        [-6, 1.3, 0, 6, 1.3, 0]
    );
    animationClips.push(new THREE.AnimationClip('WasteMoving', 2, [wasteTrack]));

    return { group, animationClips };
}
