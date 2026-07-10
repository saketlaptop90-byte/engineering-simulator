import * as materials from '../utils/materials.js';

export function createCardingMachineCylinder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.6, roughness: 0.5 });
    const wireMat = materials.wire || new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8, wireframe: true });
    const fiberMat = materials.fiber || new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    // Main cylinder
    const mainCylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 4, 32), wireMat);
    mainCylinder.rotation.z = Math.PI / 2;
    mainCylinder.position.y = 2.5;
    group.add(mainCylinder);

    const sidePlatesGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.1, 32);
    const leftPlate = new THREE.Mesh(sidePlatesGeo, metal);
    leftPlate.rotation.z = Math.PI / 2;
    leftPlate.position.set(-2.05, 2.5, 0);
    group.add(leftPlate);

    const rightPlate = new THREE.Mesh(sidePlatesGeo, metal);
    rightPlate.rotation.z = Math.PI / 2;
    rightPlate.position.set(2.05, 2.5, 0);
    group.add(rightPlate);

    // Worker and Stripper Rollers
    const rollers = [];
    for(let i=0; i<4; i++) {
        const angle = (Math.PI / 4) + i * (Math.PI / 6);
        const radius = 2.4;
        
        // Worker
        const worker = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 16), wireMat);
        worker.rotation.z = Math.PI / 2;
        worker.position.set(0, 2.5 + Math.sin(angle)*radius, Math.cos(angle)*radius);
        group.add(worker);
        rollers.push(worker);

        // Stripper
        const stripper = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4, 16), wireMat);
        stripper.rotation.z = Math.PI / 2;
        const sAngle = angle + 0.15;
        const sRadius = 2.3;
        stripper.position.set(0, 2.5 + Math.sin(sAngle)*sRadius, Math.cos(sAngle)*sRadius);
        group.add(stripper);
        rollers.push(stripper);
    }

    // Fiber web coming out
    const web = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), fiberMat);
    web.rotation.x = -Math.PI / 2;
    web.position.set(0, 0.5, 3.5);
    group.add(web);

    // Animations
    const tracks = [];
    
    // Main cylinder rotation
    tracks.push(new THREE.NumberKeyframeTrack(mainCylinder.uuid + '.rotation[x]', [0, 2], [0, -Math.PI * 2]));
    
    // Rollers rotation
    rollers.forEach((roller, idx) => {
        const speed = idx % 2 === 0 ? Math.PI * 4 : -Math.PI * 6; // Workers and strippers rotate at different speeds
        tracks.push(new THREE.NumberKeyframeTrack(roller.uuid + '.rotation[x]', [0, 2], [0, speed]));
    });

    // Web flowing
    tracks.push(new THREE.VectorKeyframeTrack(web.uuid + '.position', [0, 0.5, 1, 1.5, 2], [0,0.5,3.5, 0,0.55,3.5, 0,0.5,3.5, 0,0.55,3.5, 0,0.5,3.5]));

    const clip = new THREE.AnimationClip('Carding', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
