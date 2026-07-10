import { darkSteel, aluminum, carbonFiber, blueAccent, steel } from '../utils/materials.js';

export function createCryopumpArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main vacuum chamber / manifold
    const manifoldGeo = new THREE.BoxGeometry(8, 2, 2);
    const manifold = new THREE.Mesh(manifoldGeo, darkSteel);
    manifold.position.y = 1;
    group.add(manifold);

    // Array of Cryopumps
    const pumpGeo = new THREE.CylinderGeometry(1, 1, 3, 32);
    const coldHeadGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const baffleGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 16);

    const pumps = [];
    const coldHeads = [];

    for (let i = -1; i <= 1; i++) {
        const pumpGroup = new THREE.Group();
        pumpGroup.position.set(i * 3, 3.5, 0);

        const casing = new THREE.Mesh(pumpGeo, aluminum);
        pumpGroup.add(casing);

        const coldHead = new THREE.Mesh(coldHeadGeo, steel);
        coldHead.position.y = 2;
        pumpGroup.add(coldHead);
        coldHeads.push(coldHead);

        // Baffle arrays inside
        for(let j=0; j<5; j++) {
            const baffle = new THREE.Mesh(baffleGeo, carbonFiber);
            baffle.position.y = -1 + j * 0.4;
            pumpGroup.add(baffle);
            pumps.push(baffle);
        }

        group.add(pumpGroup);
    }

    // Piping
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const pipe = new THREE.Mesh(pipeGeo, blueAccent);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, 5, 0);
    group.add(pipe);

    // Animations
    // 1. Cold head pulsing (expander piston movement)
    coldHeads.forEach((head, index) => {
        const yTrack = new THREE.NumberKeyframeTrack(
            '.position[y]',
            [0, 0.25, 0.5],
            [2.0, 2.2, 2.0]
        );
        const clip = new THREE.AnimationClip(`PistonMove_${index}`, 0.5, [yTrack]);
        animationClips.push({ clip, target: head });
    });

    // 2. Gas capturing effect (particles)
    const particleGeo = new THREE.SphereGeometry(0.05, 4, 4);
    for(let i=0; i<15; i++) {
        const p = new THREE.Mesh(particleGeo, blueAccent);
        p.position.set((Math.random()-0.5)*8, -1, (Math.random()-0.5)*2);
        group.add(p);
        
        const track = new THREE.NumberKeyframeTrack(
            '.position[y]',
            [0, 1.5 + Math.random()],
            [-1, 3]
        );
        const clip = new THREE.AnimationClip(`ParticleMove_${i}`, 2, [track]);
        animationClips.push({ clip, target: p });
    }

    return { group, animationClips };
}
