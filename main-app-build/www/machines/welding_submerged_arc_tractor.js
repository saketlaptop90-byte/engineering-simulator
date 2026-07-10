import * as materials from '../utils/materials.js';

export function createSubmergedArcTractor(THREE) {
    const group = new THREE.Group();

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(2, 0.5, 1);
    const chassisMesh = new THREE.Mesh(chassisGeo, materials.steelPaint || new THREE.MeshStandardMaterial({ color: 0xeebb00 }));
    chassisMesh.position.y = 0.5;
    group.add(chassisMesh);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMat = materials.rubber || new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wheels = [];
    const wheelPositions = [
        [0.8, 0.3, 0.6], [0.8, 0.3, -0.6],
        [-0.8, 0.3, 0.6], [-0.8, 0.3, -0.6]
    ];
    
    wheelPositions.forEach((pos, idx) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(...pos);
        wheel.name = `wheel${idx}`;
        wheels.push(wheel);
        group.add(wheel);
    });

    // Wire Spool
    const spoolGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const spoolMesh = new THREE.Mesh(spoolGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    spoolMesh.rotation.x = Math.PI / 2;
    spoolMesh.position.set(-0.5, 1.2, 0);
    spoolMesh.name = 'spool';
    group.add(spoolMesh);

    // Flux Hopper
    const hopperGeo = new THREE.ConeGeometry(0.4, 0.8, 16);
    const hopperMesh = new THREE.Mesh(hopperGeo, materials.steelPaint || new THREE.MeshStandardMaterial({ color: 0xeebb00 }));
    hopperMesh.rotation.x = Math.PI;
    hopperMesh.position.set(0.5, 1.2, 0);
    group.add(hopperMesh);

    // Torch
    const torchGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
    const torchMesh = new THREE.Mesh(torchGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    torchMesh.position.set(0.5, 0.2, 0);
    group.add(torchMesh);

    // Animation: Tractor driving forward, wheels and spool rotating
    const times = [0, 5];
    const movePositions = [0, 0, 0, 5, 0, 0];
    const moveTrack = new THREE.VectorKeyframeTrack('.position', times, movePositions);
    
    // Using Euler rotation around local Y (which becomes global Z after initial rotation)
    const wheelTracks = wheels.map((w, i) => {
        return new THREE.NumberKeyframeTrack(`${w.name}.rotation[y]`, [0, 5], [0, Math.PI * 4]);
    });
    
    const spoolTrack = new THREE.NumberKeyframeTrack(`spool.rotation[y]`, [0, 5], [0, Math.PI * 4]);

    const clip = new THREE.AnimationClip('Drive', 5, [moveTrack, ...wheelTracks, spoolTrack]);

    return { group, animationClips: [clip] };
}
