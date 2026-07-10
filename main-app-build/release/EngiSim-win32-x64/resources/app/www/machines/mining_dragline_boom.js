import * as materialsImport from '../utils/materials.js';
const materials = materialsImport.default || materialsImport.materials || materialsImport;

export function createDraglineExcavatorBoom(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Boom base
    const boomGroup = new THREE.Group();
    boomGroup.name = "DraglineBoom";
    
    const latticeGeo = new THREE.BoxGeometry(1, 1, 20);
    const latticeMat = materials.redPaint || new THREE.MeshStandardMaterial({ color: 0xcc0000, wireframe: true });
    const boomMesh = new THREE.Mesh(latticeGeo, latticeMat);
    boomMesh.position.set(0, 0, 10);
    boomGroup.add(boomMesh);

    // Bucket and ropes
    const bucketGroup = new THREE.Group();
    bucketGroup.name = "DraglineBucket";
    const bucketGeo = new THREE.BoxGeometry(2, 1.5, 3);
    const bucketMat = materials.rustMetal || new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const bucket = new THREE.Mesh(bucketGeo, bucketMat);
    bucketGroup.add(bucket);
    boomGroup.add(bucketGroup);
    group.add(boomGroup);

    // Animation: Boom swinging and bucket dropping
    const times = [0, 5, 10];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/6, -Math.PI/4, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/4, Math.PI/4, 0));
    
    const boomTrack = new THREE.QuaternionKeyframeTrack('DraglineBoom.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q0.x, q0.y, q0.z, q0.w
    ]);

    const posTimes = [0, 2.5, 5, 7.5, 10];
    const bucketTrack = new THREE.VectorKeyframeTrack('DraglineBucket.position', posTimes, [
        0, -5, 18,
        0, -15, 18,
        0, -5, 18,
        0, -15, 18,
        0, -5, 18
    ]);

    const clip = new THREE.AnimationClip('Operate', 10, [boomTrack, bucketTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
