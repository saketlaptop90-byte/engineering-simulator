import { concrete, darkSteel, aluminum } from '../utils/materials.js';

export function createAnchoredEarthRetainingWall(THREE) {
    const group = new THREE.Group();

    // Wall panels
    const wallGeom = new THREE.BoxGeometry(0.5, 10, 10);
    const wall = new THREE.Mesh(wallGeom, concrete);
    group.add(wall);

    // Anchors
    const anchorGroup = new THREE.Group();
    anchorGroup.name = "AnchorGroup";
    group.add(anchorGroup);

    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            const x = 2; // protruding length
            const y = -3 + i*3;
            const z = -3 + j*3;
            
            const rodGeom = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
            const rod = new THREE.Mesh(rodGeom, darkSteel);
            rod.rotation.z = Math.PI/2;
            rod.position.set(x, y, z);
            anchorGroup.add(rod);

            const plateGeom = new THREE.BoxGeometry(0.2, 0.8, 0.8);
            const plate = new THREE.Mesh(plateGeom, aluminum);
            plate.position.set(0.1, y, z);
            anchorGroup.add(plate);
        }
    }

    // Animation: Anchors sliding in and tensioning
    const track = new THREE.VectorKeyframeTrack(
        'AnchorGroup.position',
        [0, 2, 4],
        [4, 0, 0,  0, 0, 0,  4, 0, 0]
    );
    const clip = new THREE.AnimationClip('Tensioning', 4, [track]);

    return { group, animationClips: [clip] };
}
