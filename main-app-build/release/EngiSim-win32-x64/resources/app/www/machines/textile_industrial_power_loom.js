import * as materials from '../utils/materials.js';

export function createIndustrialPowerLoom(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const wood = materials.wood || new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    const fabric = materials.fabric || new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    
    // Frame
    const frameBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 2.2), metal);
    frameBase.position.y = 0.1;
    group.add(frameBase);
    
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), metal);
    leftLeg.position.set(-1.9, 1.5, 0.9);
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), metal);
    rightLeg.position.set(1.9, 1.5, 0.9);
    group.add(rightLeg);

    const backLeftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), metal);
    backLeftLeg.position.set(-1.9, 1.5, -0.9);
    group.add(backLeftLeg);

    const backRightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), metal);
    backRightLeg.position.set(1.9, 1.5, -0.9);
    group.add(backRightLeg);

    // Beams
    const warpBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3.8, 16), wood);
    warpBeam.rotation.z = Math.PI / 2;
    warpBeam.position.set(0, 2, -1);
    group.add(warpBeam);

    const clothBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3.8, 16), wood);
    clothBeam.rotation.z = Math.PI / 2;
    clothBeam.position.set(0, 1, 1);
    group.add(clothBeam);

    // Heddles
    const harness1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 0.1), wood);
    harness1.position.set(0, 2, 0);
    group.add(harness1);

    const harness2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 0.1), wood);
    harness2.position.set(0, 2, 0.2);
    group.add(harness2);

    // Shuttle
    const shuttle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), wood);
    shuttle.position.set(-1.5, 2, 0.5);
    group.add(shuttle);

    // Reed
    const reed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.4, 0.1), metal);
    reed.position.set(0, 2, 0.7);
    group.add(reed);

    // Fabric strip
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2), fabric);
    cloth.rotation.x = -Math.PI / 2;
    cloth.position.set(0, 2, -0.5);
    group.add(cloth);

    // Animations
    const harness1Track = new THREE.VectorKeyframeTrack(
        harness1.uuid + '.position',
        [0, 0.5, 1, 1.5, 2],
        [0,2,0, 0,2.3,0, 0,2,0, 0,1.7,0, 0,2,0]
    );
    const harness2Track = new THREE.VectorKeyframeTrack(
        harness2.uuid + '.position',
        [0, 0.5, 1, 1.5, 2],
        [0,2,0.2, 0,1.7,0.2, 0,2,0.2, 0,2.3,0.2, 0,2,0.2]
    );

    const shuttleTrack = new THREE.VectorKeyframeTrack(
        shuttle.uuid + '.position',
        [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        [-1.5,2,0.5, 1.5,2,0.5, 1.5,2,0.5, -1.5,2,0.5, -1.5,2,0.5, 1.5,2,0.5, 1.5,2,0.5, -1.5,2,0.5, -1.5,2,0.5]
    );

    const reedTrack = new THREE.VectorKeyframeTrack(
        reed.uuid + '.position',
        [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        [0,2,0.7, 0,2,0.9, 0,2,0.7, 0,2,0.9, 0,2,0.7, 0,2,0.9, 0,2,0.7, 0,2,0.9, 0,2,0.7]
    );

    const clip = new THREE.AnimationClip('LoomOperation', 2, [harness1Track, harness2Track, shuttleTrack, reedTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
