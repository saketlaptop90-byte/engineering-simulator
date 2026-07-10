import { wood, steel, copper, blackPlastic } from '../utils/materials.js';

export function createElectricGuitar(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.BoxGeometry(1.5, 0.2, 2);
    const body = new THREE.Mesh(bodyGeo, wood);
    group.add(body);

    // Neck
    const neckGeo = new THREE.BoxGeometry(0.3, 0.1, 3);
    const neck = new THREE.Mesh(neckGeo, wood);
    neck.position.set(0, 0.1, -2.5);
    group.add(neck);

    // Pickups
    const pickupGeo = new THREE.BoxGeometry(0.8, 0.05, 0.3);
    const pickup = new THREE.Mesh(pickupGeo, blackPlastic);
    pickup.position.set(0, 0.125, -0.5);
    group.add(pickup);

    // Strings
    const stringGeo = new THREE.CylinderGeometry(0.005, 0.005, 4.5);
    for(let i=0; i<6; i++) {
        const stringMesh = new THREE.Mesh(stringGeo, steel);
        stringMesh.rotation.x = Math.PI / 2;
        const xPos = -0.1 + i*0.04;
        stringMesh.position.set(xPos, 0.2, -1.5);
        stringMesh.name = `guitar_string_${i}`;
        group.add(stringMesh);

        // vibrate strings
        const times = [0, 0.05, 0.1];
        const values = [xPos, xPos + 0.02, xPos];
        const track = new THREE.NumberKeyframeTrack(`${stringMesh.name}.position[x]`, times, values);
        const clip = new THREE.AnimationClip(`vibrate_string_${i}`, 0.1, [track]);
        animationClips.push(clip);
    }

    return { group, animationClips };
}
