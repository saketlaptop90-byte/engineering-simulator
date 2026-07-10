import { steel, castIron, aluminum, orangeAccent, rubber, plastic } from '../utils/materials.js';

export function createInjectionMoldingPlaten(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, castIron);
    base.position.y = 0.25;
    group.add(base);

    // Fixed Platen
    const fixedPlatenGeo = new THREE.BoxGeometry(1, 3, 2.5);
    const fixedPlaten = new THREE.Mesh(fixedPlatenGeo, steel);
    fixedPlaten.position.set(-1.5, 2, 0);
    group.add(fixedPlaten);

    // Moving Platen
    const movingPlatenGeo = new THREE.BoxGeometry(1, 3, 2.5);
    const movingPlaten = new THREE.Mesh(movingPlatenGeo, steel);
    movingPlaten.position.set(1.5, 2, 0);
    group.add(movingPlaten);

    // Tie Bars
    const tieBarGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const tieBarGeoRotated = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    tieBarGeoRotated.rotateZ(Math.PI / 2);
    
    const positions = [
        [0, 3, 1],
        [0, 3, -1],
        [0, 1, 1],
        [0, 1, -1]
    ];

    positions.forEach(pos => {
        const tieBar = new THREE.Mesh(tieBarGeoRotated, aluminum);
        tieBar.position.set(pos[0], pos[1], pos[2]);
        group.add(tieBar);
    });

    // Mold halves
    const moldFixedGeo = new THREE.BoxGeometry(0.5, 1.5, 1.5);
    const moldFixed = new THREE.Mesh(moldFixedGeo, orangeAccent);
    moldFixed.position.set(0.5, 0, 0);
    fixedPlaten.add(moldFixed);

    const moldMovingGeo = new THREE.BoxGeometry(0.5, 1.5, 1.5);
    const moldMoving = new THREE.Mesh(moldMovingGeo, orangeAccent);
    moldMoving.position.set(-0.5, 0, 0);
    movingPlaten.add(moldMoving);

    // Animation (Opening and Closing)
    const times = [0, 2, 4, 5];
    const values = [
        1.5, 2, 0, // open
        -0.5, 2, 0, // closed
        -0.5, 2, 0, // hold
        1.5, 2, 0 // open
    ];
    const track = new THREE.VectorKeyframeTrack('.position', times, values);
    const clip = new THREE.AnimationClip('MoldCycle', 5, [track]);
    
    // Add track to moving platen
    movingPlaten.name = 'MovingPlaten';
    track.name = movingPlaten.name + '.position';
    
    animationClips.push(clip);

    return { group, animationClips };
}
