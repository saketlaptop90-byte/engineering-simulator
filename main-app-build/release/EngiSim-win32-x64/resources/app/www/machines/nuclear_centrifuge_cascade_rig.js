import * as sharedMaterials from '../utils/materials.js';

export function createCentrifugeCascadeRig(THREE) {
    const group = new THREE.Group();
    
    // Materials with fallback
    const casingMat = sharedMaterials.aluminum || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const pipeMat = sharedMaterials.pipe || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5, roughness: 0.5 });
    
    const rotors = [];
    
    // Create a cascade grid of centrifuges
    for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 2; z++) {
            const centGroup = new THREE.Group();
            centGroup.position.set(x * 3 - 6, 0, z * 3 - 1.5);
            
            // Outer casing
            const casingGeo = new THREE.CylinderGeometry(1, 1, 8, 32);
            const casing = new THREE.Mesh(casingGeo, casingMat);
            casing.position.y = 4;
            centGroup.add(casing);
            
            // Inner rotor indicator (spinning part visible on top)
            const indicatorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
            // Giving it a distinct color/texture to visualize rotation
            const indMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
            const indicator = new THREE.Mesh(indicatorGeo, indMat);
            indicator.position.y = 8.25;
            centGroup.add(indicator);
            
            rotors.push(indicator);
            group.add(centGroup);
            
            // Connecting pipes for the cascade
            if (x < 4) {
                const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
                const pipe = new THREE.Mesh(pipeGeo, pipeMat);
                pipe.rotation.z = Math.PI / 2;
                pipe.position.set(x * 3 - 4.5, 7, z * 3 - 1.5);
                group.add(pipe);
            }
        }
    }
    
    // Animation: High speed rotation of centrifuges
    const tracks = [];
    rotors.forEach(rotor => {
        const times = [0, 1];
        const values = [0, Math.PI * 20]; // Fast rotation
        tracks.push(new THREE.NumberKeyframeTrack(rotor.uuid + '.rotation[y]', times, values));
    });
    
    const clip = new THREE.AnimationClip('CentrifugeSpin', 1, tracks);
    
    return { group, animationClips: [clip] };
}
