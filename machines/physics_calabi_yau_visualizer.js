import { glass, gold, darkSteel } from '../utils/materials.js';

export function createCalabiYauVisualizer(THREE) {
    const group = new THREE.Group();
    function generateId() { return Math.random().toString(36).substr(2, 9); }
    
    const baseGeometry = new THREE.CylinderGeometry(4, 4.5, 0.5, 32);
    const base = new THREE.Mesh(baseGeometry, darkSteel);
    group.add(base);
    
    const manifoldGroup = new THREE.Group();
    manifoldGroup.position.y = 3;
    manifoldGroup.name = "manifoldGroup_" + generateId();
    group.add(manifoldGroup);
    
    const ring1Geometry = new THREE.TorusKnotGeometry(1.5, 0.2, 100, 16);
    const ring1 = new THREE.Mesh(ring1Geometry, gold);
    ring1.name = "ring1_" + generateId();
    manifoldGroup.add(ring1);
    
    const ring2Geometry = new THREE.TorusKnotGeometry(1.2, 0.15, 100, 16, 3, 4);
    const ring2 = new THREE.Mesh(ring2Geometry, glass);
    ring2.name = "ring2_" + generateId();
    manifoldGroup.add(ring2);
    
    const animationClips = [];
    const times = [0, 2, 4];
    
    const scales1 = [
        1, 1, 1,
        1.5, 0.5, 1.5,
        1, 1, 1
    ];
    const scaleTrack1 = new THREE.VectorKeyframeTrack(`${ring1.name}.scale`, times, scales1);
    
    const scales2 = [
        1, 1, 1,
        0.5, 1.5, 0.5,
        1, 1, 1
    ];
    const scaleTrack2 = new THREE.VectorKeyframeTrack(`${ring2.name}.scale`, times, scales2);
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, Math.PI / 2, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 2, Math.PI, 0));
    
    const rotTrack = new THREE.QuaternionKeyframeTrack(`${manifoldGroup.name}.quaternion`, times, [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    const clip = new THREE.AnimationClip('SpacetimeFold', 4, [scaleTrack1, scaleTrack2, rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
