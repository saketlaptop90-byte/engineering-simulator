import * as materialsImport from '../utils/materials.js';
const materials = materialsImport.default || materialsImport.materials || materialsImport;

export function createBucketWheelExcavator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Boom arm
    const boomGeo = new THREE.BoxGeometry(2, 2, 10);
    const boomMat = materials.yellowPaint || new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const boom = new THREE.Mesh(boomGeo, boomMat);
    boom.position.set(0, 0, -5);
    group.add(boom);

    // Wheel
    const wheelGroup = new THREE.Group();
    wheelGroup.name = "BucketWheel";
    const wheelGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
    const wheelMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheelGroup.add(wheel);

    // Buckets
    const numBuckets = 12;
    const bucketGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const bucketMat = materials.rustMetal || new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    for (let i = 0; i < numBuckets; i++) {
        const angle = (i / numBuckets) * Math.PI * 2;
        const bucket = new THREE.Mesh(bucketGeo, bucketMat);
        bucket.position.set(Math.cos(angle) * 5, Math.sin(angle) * 5, 0);
        bucket.rotation.z = angle;
        wheelGroup.add(bucket);
    }
    
    wheelGroup.position.set(0, 0, 0);
    group.add(wheelGroup);

    // Animation: Rotate wheel
    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    
    const track = new THREE.QuaternionKeyframeTrack('BucketWheel.quaternion', times, [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    const clip = new THREE.AnimationClip('Spin', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
