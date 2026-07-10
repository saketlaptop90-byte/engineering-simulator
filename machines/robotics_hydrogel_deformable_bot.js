import { copper, darkSteel } from '../utils/materials.js';

export function createHydrogelDeformableBot(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const gelMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        transmission: 0.9,
        opacity: 0.8,
        transparent: true,
        roughness: 0.1,
        ior: 1.33
    });

    // We will use morph targets for deformation
    const geo = new THREE.SphereGeometry(1, 32, 32);
    geo.morphAttributes.position = [];
    
    const posAttribute = geo.attributes.position;
    const target1 = new Float32Array(posAttribute.count * 3);
    const target2 = new Float32Array(posAttribute.count * 3);
    
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        
        // Target 1: Flattened
        target1[i * 3] = x * 1.5;
        target1[i * 3 + 1] = y * 0.5;
        target1[i * 3 + 2] = z * 1.5;
        
        // Target 2: Elongated
        target2[i * 3] = x * 0.5;
        target2[i * 3 + 1] = y * 2.0;
        target2[i * 3 + 2] = z * 0.5;
    }

    geo.morphAttributes.position[0] = new THREE.BufferAttribute(target1, 3);
    geo.morphAttributes.position[1] = new THREE.BufferAttribute(target2, 3);

    const mesh = new THREE.Mesh(geo, gelMat);
    mesh.name = "HydrogelBody";
    mesh.morphTargetInfluences = [0, 0];
    group.add(mesh);

    // Inner core
    const coreGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const core = new THREE.Mesh(coreGeo, copper);
    group.add(core);

    // Animation
    const times = [0, 1, 2, 3, 4];
    const values1 = [0, 1, 0, 0, 0];
    const values2 = [0, 0, 0, 1, 0];

    const track1 = new THREE.NumberKeyframeTrack(`${mesh.name}.morphTargetInfluences[0]`, times, values1);
    const track2 = new THREE.NumberKeyframeTrack(`${mesh.name}.morphTargetInfluences[1]`, times, values2);

    const clip = new THREE.AnimationClip('GelDeformation', 4, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
