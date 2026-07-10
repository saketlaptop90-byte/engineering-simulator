import { steel, aluminum, blueAccent, darkSteel, glass } from '../utils/materials.js';

export function createPneumaticCylinder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main barrel
    const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const barrelMat = glass.clone();
    barrelMat.opacity = 0.5;
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.rotation.z = Math.PI / 2;
    group.add(barrel);

    // End caps
    const capGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 32);
    const leftCap = new THREE.Mesh(capGeo, darkSteel);
    leftCap.position.x = -2.2;
    leftCap.rotation.z = Math.PI / 2;
    group.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, darkSteel);
    rightCap.position.x = 2.2;
    rightCap.rotation.z = Math.PI / 2;
    group.add(rightCap);

    // Tie rods
    const tieGeo = new THREE.CylinderGeometry(0.05, 0.05, 4.4, 8);
    const positions = [
        [0.7, 0.7], [0.7, -0.7], [-0.7, 0.7], [-0.7, -0.7]
    ];
    positions.forEach(pos => {
        const tie = new THREE.Mesh(tieGeo, steel);
        tie.position.set(0, pos[0], pos[1]);
        tie.rotation.z = Math.PI / 2;
        group.add(tie);
    });

    // Piston Head
    const pistonHeadGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.4, 32);
    const pistonHead = new THREE.Mesh(pistonHeadGeo, aluminum);
    pistonHead.rotation.z = Math.PI / 2;
    
    // Piston Rod
    const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const rod = new THREE.Mesh(rodGeo, steel);
    rod.position.y = 2; // relative to pistonHead
    pistonHead.add(rod);

    group.add(pistonHead);

    // Air visualization (blue spheres for high pressure air)
    const airGroup = new THREE.Group();
    const airGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const airMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 });
    for(let i=0; i<30; i++) {
        const particle = new THREE.Mesh(airGeo, airMat);
        particle.userData = {
            baseX: Math.random() * 2 - 1,
            baseY: (Math.random() - 0.5) * 1.2,
            baseZ: (Math.random() - 0.5) * 1.2
        };
        airGroup.add(particle);
    }
    group.add(airGroup);

    // Animations
    const strokeTrack = new THREE.VectorKeyframeTrack(
        pistonHead.uuid + '.position',
        [0, 1, 2, 3, 4],
        [
            -1.8, 0, 0,
             1.8, 0, 0,
             1.8, 0, 0,
            -1.8, 0, 0,
            -1.8, 0, 0
        ]
    );

    const tracks = [strokeTrack];
    
    airGroup.children.forEach(particle => {
        const u = particle.userData;
        
        const ptTrack = new THREE.VectorKeyframeTrack(
            particle.uuid + '.position',
            [0, 1, 2, 3, 4],
            [
                -2 + (0.2 + u.baseX * 0.1), u.baseY, u.baseZ,
                -2 + (3.8 * (u.baseX * 0.5 + 0.5)), u.baseY, u.baseZ,
                -2 + (3.8 * (u.baseX * 0.5 + 0.5)), u.baseY, u.baseZ, 
                -2 + (0.2 + u.baseX * 0.1), u.baseY, u.baseZ,
                -2 + (0.2 + u.baseX * 0.1), u.baseY, u.baseZ
            ]
        );
        tracks.push(ptTrack);
    });

    const clip = new THREE.AnimationClip('CylinderCycle', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
