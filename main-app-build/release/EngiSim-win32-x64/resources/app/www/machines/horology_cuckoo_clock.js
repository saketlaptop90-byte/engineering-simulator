import { materials } from '../utils/materials.js';

export function createCuckooClock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // House (Wood)
    const houseGeometry = new THREE.BoxGeometry(3, 4, 2);
    const house = new THREE.Mesh(houseGeometry, materials.wood);
    house.position.y = 2;
    group.add(house);

    // Roof (Wood)
    const roofGeometry = new THREE.ConeGeometry(2.5, 1.5, 4);
    const roof = new THREE.Mesh(roofGeometry, materials.wood);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 4.75;
    group.add(roof);

    // Door (Wood)
    const door = new THREE.Group();
    door.name = "Door";
    door.position.set(0, 3, 1.0);
    
    const doorMeshGeom = new THREE.BoxGeometry(0.8, 1, 0.1);
    const doorMesh = new THREE.Mesh(doorMeshGeom, materials.wood);
    doorMesh.position.set(0, 0, 0.05);
    door.add(doorMesh);
    group.add(door);

    // Bird (Gold)
    const bird = new THREE.Group();
    bird.name = "Bird";
    bird.position.set(0, 3, 0.5);

    const birdBodyGeom = new THREE.BoxGeometry(0.4, 0.4, 0.6);
    const birdBody = new THREE.Mesh(birdBodyGeom, materials.gold);
    bird.add(birdBody);
    group.add(bird);

    // Animation: Bird pops out, door opens
    const doorTrack = new THREE.NumberKeyframeTrack(
        'Door.rotation[x]',
        [0, 0.5, 1, 1.5, 2],
        [0, -Math.PI/2, -Math.PI/2, 0, 0]
    );

    const birdTrack = new THREE.NumberKeyframeTrack(
        'Bird.position[z]',
        [0, 0.5, 1, 1.5, 2],
        [0.5, 1.5, 1.5, 0.5, 0.5]
    );

    const cuckooClip = new THREE.AnimationClip('CuckooAction', 2, [doorTrack, birdTrack]);
    animationClips.push(cuckooClip);

    return { group, animationClips };
}
