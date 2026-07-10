import * as materials from '../utils/materials.js';

export function createVacuumCircuitBreaker(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const steelMaterial = materials.steel || new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.9, roughness: 0.2 });
    const silverMaterial = materials.silver || new THREE.MeshStandardMaterial({ color: 0xe5e4e2, metalness: 1.0, roughness: 0.1 });
    const ceramicMaterial = materials.ceramic || new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.9 });

    // Main housing
    const housingGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    const housing = new THREE.Mesh(housingGeo, ceramicMaterial);
    housing.position.y = 2;
    group.add(housing);

    // Fixed contact
    const fixedContactGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const fixedContact = new THREE.Mesh(fixedContactGeo, silverMaterial);
    fixedContact.position.y = 3;
    group.add(fixedContact);

    // Moving contact
    const movingContactGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const movingContact = new THREE.Mesh(movingContactGeo, silverMaterial);
    movingContact.position.y = 1.5;
    movingContact.name = 'movingContact';
    group.add(movingContact);

    // Operating mechanism
    const mechGeo = new THREE.BoxGeometry(2, 1, 2);
    const mech = new THREE.Mesh(mechGeo, steelMaterial);
    mech.position.y = -0.5;
    group.add(mech);

    // Animation: Breaker opening and closing
    const times = [0, 0.1, 1, 1.1, 2];
    const values = [1.5, 0.5, 0.5, 1.5, 1.5]; // Y position of moving contact
    
    const movingTrack = new THREE.VectorKeyframeTrack(
        movingContact.uuid + '.position',
        times,
        [0, values[0], 0, 0, values[1], 0, 0, values[2], 0, 0, values[3], 0, 0, values[4], 0]
    );

    const clip = new THREE.AnimationClip('BreakCircuit', 2, [movingTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
