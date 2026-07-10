import { copper, darkSteel } from '../utils/materials.js';

export function createPneumaticTentacle(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Custom material
    const siliconeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        transmission: 0.8,
        opacity: 0.9,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
    });

    const numSegments = 10;
    const segmentHeight = 1;
    const radius = 0.5;

    const boneGroup = new THREE.Group();
    group.add(boneGroup);

    // Create a chain of bones and mesh for tentacle
    const bones = [];
    const geometry = new THREE.CylinderGeometry(radius * 0.5, radius, segmentHeight * numSegments, 16, numSegments * 4);
    geometry.translate(0, (segmentHeight * numSegments) / 2, 0);

    const positionAttribute = geometry.attributes.position;
    const skinIndices = [];
    const skinWeights = [];

    for (let i = 0; i < positionAttribute.count; i++) {
        const y = positionAttribute.getY(i);
        const skinIndex = Math.floor(y / segmentHeight);
        const skinWeight = (y % segmentHeight) / segmentHeight;

        skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
        skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    let prevBone = new THREE.Bone();
    bones.push(prevBone);
    boneGroup.add(prevBone);

    for (let i = 1; i <= numSegments; i++) {
        const bone = new THREE.Bone();
        bone.position.y = segmentHeight;
        bones.push(bone);
        prevBone.add(bone);
        prevBone = bone;
    }

    const skeleton = new THREE.Skeleton(bones);
    const mesh = new THREE.SkinnedMesh(geometry, siliconeMaterial);
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    group.add(mesh);

    // Base
    const baseGeo = new THREE.CylinderGeometry(radius * 1.5, radius * 1.5, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.y = -0.25;
    group.add(baseMesh);

    // Animation
    const tracks = [];
    
    for (let i = 1; i < bones.length; i++) {
        const values = [
            0, 0, 0,
            Math.PI / 8, 0, 0,
            0, 0, Math.PI / 8,
            -Math.PI / 8, 0, 0,
            0, 0, 0
        ];
        
        const qTimes = [0, 1, 2, 3, 4];
        const qValues = [];
        const euler = new THREE.Euler();
        const q = new THREE.Quaternion();
        
        for(let j=0; j<5; j++) {
             euler.set(values[j*3], values[j*3+1], values[j*3+2]);
             q.setFromEuler(euler);
             qValues.push(q.x, q.y, q.z, q.w);
        }

        const track = new THREE.QuaternionKeyframeTrack(`${bones[i].uuid}.quaternion`, qTimes, qValues);
        tracks.push(track);
    }

    const clip = new THREE.AnimationClip('TentacleCurl', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
