import * as materials from '../utils/materials.js';

export function createStudioMonitorCrossover(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // PCB Board
    const boardGeo = new THREE.BoxGeometry(6, 0.1, 4);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x005500, roughness: 0.8 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    group.add(board);

    // Inductors (Copper Coils)
    const inductorGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 32);
    const inductorMat = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.5, roughness: 0.3 });
    
    const ind1 = new THREE.Mesh(inductorGeo, inductorMat);
    ind1.rotation.x = Math.PI / 2;
    ind1.position.set(-1.5, 0.25, -0.5);
    group.add(ind1);

    const ind2 = new THREE.Mesh(inductorGeo, inductorMat);
    ind2.rotation.x = Math.PI / 2;
    ind2.position.set(1.5, 0.25, 0.5);
    group.add(ind2);

    // Capacitors (Cylinders)
    const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const capMat = materials.plastic || new THREE.MeshStandardMaterial({ color: 0x1111ee });
    
    const caps = [];
    for (let i = 0; i < 3; i++) {
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.rotation.z = Math.PI / 2;
        cap.position.set(0, 0.3, -1.2 + i * 1.2);
        group.add(cap);
        caps.push(cap);
    }

    // Resistors
    const resGeo = new THREE.BoxGeometry(1, 0.2, 0.2);
    const resMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    for (let i = 0; i < 2; i++) {
        const res = new THREE.Mesh(resGeo, resMat);
        res.position.set(-2 + i * 4, 0.15, 1.5);
        group.add(res);
    }

    // Animation: Visualizing frequency splitting (pulsing capacitors)
    const times = [0, 0.5, 1, 1.5, 2];
    caps.forEach((cap, index) => {
        const offset = index * 0.3;
        const scaleValues = [1, 1.1, 1, 1.05, 1];
        const trackX = new THREE.NumberKeyframeTrack(`${cap.uuid}.scale[x]`, times.map(t => t + offset), scaleValues);
        const trackY = new THREE.NumberKeyframeTrack(`${cap.uuid}.scale[y]`, times.map(t => t + offset), scaleValues);
        const trackZ = new THREE.NumberKeyframeTrack(`${cap.uuid}.scale[z]`, times.map(t => t + offset), scaleValues);
        
        const clip = new THREE.AnimationClip(`cap_pulse_${index}`, 2.5, [trackX, trackY, trackZ]);
        animationClips.push(clip);
    });

    return { group, animationClips };
}
