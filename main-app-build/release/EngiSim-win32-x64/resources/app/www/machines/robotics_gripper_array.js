import * as materials from '../utils/materials.js';

export function createGripperArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseMat = materials.metalBase || new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.8});
    const gripperMat = materials.metalHighlight || new THREE.MeshStandardMaterial({color: 0xff5500, roughness: 0.3});

    // Main structural array base
    const arrayBase = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.2, 4.5), baseMat);
    group.add(arrayBase);

    // Grid of 3x3 grippers
    for (let x = -1.5; x <= 1.5; x += 1.5) {
        for (let z = -1.5; z <= 1.5; z += 1.5) {
            const indexStr = `${x}_${z}`.replace(/\./g, '_').replace(/-/g, 'm');
            
            const gripperMount = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16), baseMat);
            gripperMount.position.set(x, 0.35, z);
            group.add(gripperMount);

            const leftFinger = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.15), gripperMat);
            leftFinger.position.set(x - 0.15, 0.7, z);
            leftFinger.name = `LeftFinger_${indexStr}`;
            group.add(leftFinger);

            const rightFinger = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.15), gripperMat);
            rightFinger.position.set(x + 0.15, 0.7, z);
            rightFinger.name = `RightFinger_${indexStr}`;
            group.add(rightFinger);

            // Staggered animation based on position
            const stagger = Math.abs(x) + Math.abs(z);
            const times = [0, 1, 2, 3];
            
            // Open, Close, Close, Open
            const leftVals = [
                x - 0.2, 0.7, z, 
                x - 0.05, 0.7, z, 
                x - 0.05, 0.7, z, 
                x - 0.2, 0.7, z
            ];
            const rightVals = [
                x + 0.2, 0.7, z, 
                x + 0.05, 0.7, z, 
                x + 0.05, 0.7, z, 
                x + 0.2, 0.7, z
            ];

            // Offset the times for staggered effect
            const offsetTimes = times.map(t => (t + stagger * 0.5) % 3);

            const leftTrack = new THREE.VectorKeyframeTrack(`${leftFinger.name}.position`, times, leftVals);
            const rightTrack = new THREE.VectorKeyframeTrack(`${rightFinger.name}.position`, times, rightVals);
            
            animationClips.push(new THREE.AnimationClip(`Grip_${indexStr}`, 3, [leftTrack, rightTrack]));
        }
    }

    return { group, animationClips };
}
