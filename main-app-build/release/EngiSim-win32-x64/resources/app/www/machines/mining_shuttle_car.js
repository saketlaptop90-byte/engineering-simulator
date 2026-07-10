import * as sharedMaterials from '../utils/materials.js';

export function createShuttleCar(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const orangePaint = sharedMaterials.orangePaint || new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.5 });
    const rubber = sharedMaterials.rubber || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const darkMetal = sharedMaterials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });

    // Low Profile Main Chassis
    const chassisGeo = new THREE.BoxGeometry(3, 1, 10);
    const chassis = new THREE.Mesh(chassisGeo, orangePaint);
    chassis.position.y = 0.8;
    group.add(chassis);

    // Operator Canopy Side Profile
    const canopyGeo = new THREE.BoxGeometry(1.5, 0.1, 2);
    const canopy = new THREE.Mesh(canopyGeo, orangePaint);
    canopy.position.set(1.5, 2, 2);
    group.add(canopy);

    // Operator Canopy Posts
    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const post1 = new THREE.Mesh(postGeo, darkMetal);
    post1.position.set(0.8, 1.5, 1.1);
    group.add(post1);
    
    const post2 = new THREE.Mesh(postGeo, darkMetal);
    post2.position.set(2.2, 1.5, 1.1);
    group.add(post2);

    // Rugged Rubber Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
    const wheels = [];
    const wheelPositions = [
        [-1.6, 0.6, -3],
        [ 1.6, 0.6, -3],
        [-1.6, 0.6,  3],
        [ 1.6, 0.6,  3]
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, rubber);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
        wheels.push(wheel);
    });

    // Central Chain Conveyor Bed
    const conveyorGeo = new THREE.BoxGeometry(1.5, 0.1, 9.8);
    const conveyor = new THREE.Mesh(conveyorGeo, darkMetal);
    conveyor.position.set(0, 1.35, 0);
    group.add(conveyor);

    // Cable Reel
    const reelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16);
    const reel = new THREE.Mesh(reelGeo, darkMetal);
    reel.rotation.z = Math.PI / 2;
    reel.position.set(-1.6, 1.5, -4);
    group.add(reel);

    // Animation: Car tramps forward to load, backward to discharge
    const wheelTracks = wheels.map(wheel => {
        return new THREE.NumberKeyframeTrack(
            wheel.uuid + '.rotation[x]',
            [0, 2, 4],
            [0, Math.PI * 4, 0]
        );
    });

    const moveTrack = new THREE.NumberKeyframeTrack(
        group.uuid + '.position[z]',
        [0, 2, 4],
        [0, -5, 0]
    );

    // The trailing cable reel spinning as the car moves
    const reelTrack = new THREE.NumberKeyframeTrack(
        reel.uuid + '.rotation[x]',
        [0, 2, 4],
        [0, Math.PI * 4, 0]
    );

    const clip = new THREE.AnimationClip('ShuttleCarCycle', 4, [...wheelTracks, moveTrack, reelTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
