import { blackPlastic, aluminum, glass, wood } from '../utils/materials.js';

export function createLargeFormatViewCamera(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Bed
    const bedGeometry = new THREE.BoxGeometry(1.5, 0.2, 4);
    const bed = new THREE.Mesh(bedGeometry, wood);
    bed.position.set(0, -1, 0);
    group.add(bed);

    // Rear Standard
    const rearGeom = new THREE.BoxGeometry(2, 2.5, 0.4);
    const rear = new THREE.Mesh(rearGeom, wood);
    rear.position.set(0, 0.35, -1.8);
    group.add(rear);

    // Ground Glass
    const ggGeom = new THREE.PlaneGeometry(1.6, 2);
    const groundGlass = new THREE.Mesh(ggGeom, glass);
    groundGlass.position.set(0, 0.35, -1.99);
    groundGlass.rotation.y = Math.PI;
    group.add(groundGlass);

    // Front Standard
    const frontGeom = new THREE.BoxGeometry(1.8, 2.2, 0.4);
    const front = new THREE.Mesh(frontGeom, wood);
    front.position.set(0, 0.2, 1);
    group.add(front);

    // Lens Board
    const lensBoardGeom = new THREE.BoxGeometry(1, 1, 0.5);
    const lensBoard = new THREE.Mesh(lensBoardGeom, aluminum);
    lensBoard.position.set(0, 0.2, 1.05);
    group.add(lensBoard);

    // Lens
    const lensGeom = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 32);
    lensGeom.rotateX(Math.PI / 2);
    const lens = new THREE.Mesh(lensGeom, glass);
    lens.position.set(0, 0.2, 1.4);
    group.add(lens);

    // Bellows (Simplified using scaled boxes)
    const bellowsGroup = new THREE.Group();
    for(let i=0; i<10; i++) {
        const fold = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2, 0.1), blackPlastic);
        fold.position.z = -1.6 + (i * 0.25);
        bellowsGroup.add(fold);
    }
    group.add(bellowsGroup);

    // Animation: Focusing (Front standard moving, bellows stretching)
    const times = [0, 2, 4];
    const frontZ = [1, 1.8, 1];
    
    const frontTrack = new THREE.NumberKeyframeTrack(`${front.uuid}.position[z]`, times, frontZ);
    const boardTrack = new THREE.NumberKeyframeTrack(`${lensBoard.uuid}.position[z]`, times, [1.05, 1.85, 1.05]);
    const lensTrack = new THREE.NumberKeyframeTrack(`${lens.uuid}.position[z]`, times, [1.4, 2.2, 1.4]);
    
    const tracks = [frontTrack, boardTrack, lensTrack];

    for(let i=0; i<10; i++) {
        const foldTracks = new THREE.NumberKeyframeTrack(`${bellowsGroup.children[i].uuid}.position[z]`, times, [-1.6 + (i * 0.25), -1.6 + (i * 0.33), -1.6 + (i * 0.25)]);
        tracks.push(foldTracks);
    }

    const clip = new THREE.AnimationClip('Focusing', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
